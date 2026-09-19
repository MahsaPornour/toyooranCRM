import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { DatabaseSync } from 'node:sqlite';
import { generateSecret, generateURI, verify } from 'otplib';
import type { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const dataDir = path.resolve(process.env.DATA_DIR || './data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, 'toyooran.sqlite'));
db.exec('PRAGMA journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'superadmin', mfa_secret TEXT, mfa_enabled INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (id_hash TEXT PRIMARY KEY, admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE, mfa_verified INTEGER NOT NULL DEFAULT 1, expires_at INTEGER NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admin_state (state_key TEXT PRIMARY KEY, state_json TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER, action TEXT NOT NULL, target TEXT, ip TEXT, user_agent TEXT, created_at TEXT NOT NULL);`);
db.exec('CREATE TABLE IF NOT EXISTS mfa_recovery_codes (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER NOT NULL, code_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, used_at TEXT)');
db.exec('CREATE TABLE IF NOT EXISTS password_history (id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL)');
db.exec('CREATE TABLE IF NOT EXISTS rate_limits (rate_key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL)');
try { db.exec("ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'superadmin'"); } catch { /* migration already applied */ }
try { db.exec('ALTER TABLE sessions ADD COLUMN mfa_verified INTEGER NOT NULL DEFAULT 1'); } catch { /* migration already applied */ }
const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'ToyooranAdmin2025!Super';
const bootstrapUser = process.env.ADMIN_USERNAME || 'admin';
if (!db.prepare('SELECT id FROM admins LIMIT 1').get()) {
  db.prepare('INSERT INTO admins (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)').run(bootstrapUser, bcrypt.hashSync(bootstrapPassword, 12), 'superadmin', new Date().toISOString());
}
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
const hashRecoveryCode = (code: string) => crypto.createHash('sha256').update(code.replace(/-/g, '').toUpperCase()).digest('hex');
const issueSession = (adminId: number, res: Response, mfaVerified: boolean) => {
  const token = crypto.randomBytes(32).toString('base64url');
  db.prepare('INSERT INTO sessions (id_hash, admin_id, mfa_verified, expires_at, created_at) VALUES (?, ?, ?, ?, ?)').run(hashToken(token), adminId, mfaVerified ? 1 : 0, Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS, new Date().toISOString());
  res.cookie('toyooran_admin_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: SESSION_TTL_SECONDS * 1000, path: '/' });
};
export type AdminRequest = Request & { admin?: { id: number; username: string; role: string; mfaEnabled: boolean } };
function sessionRow(req: AdminRequest) {
  const token = req.cookies?.toyooran_admin_session;
  return token ? db.prepare('SELECT a.id, a.username, a.role, a.mfa_enabled, s.mfa_verified FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.id_hash=? AND s.expires_at>?').get(hashToken(token), Math.floor(Date.now() / 1000)) as any : null;
}
export function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const row = sessionRow(req);
  if (!row) return res.status(401).json({ error: 'نشست منقضی یا نامعتبر است.' });
  if (row.mfa_enabled && !row.mfa_verified) return res.status(401).json({ error: 'تأیید MFA لازم است.', mfaRequired: true });
  req.admin = { id: row.id, username: row.username, role: row.role, mfaEnabled: Boolean(row.mfa_enabled) }; next();
}
export function requireRole(...roles: string[]) { return (req: AdminRequest, res: Response, next: NextFunction) => { if (!req.admin || !roles.includes(req.admin.role)) return res.status(403).json({ error: 'دسترسی کافی نیست.' }); next(); }; }
export function requireMfaPending(req: AdminRequest, res: Response, next: NextFunction) { const row = sessionRow(req); if (!row || !row.mfa_enabled || row.mfa_verified) return res.status(401).json({ error: 'MFA challenge نامعتبر است.' }); req.admin = { id: row.id, username: row.username, role: row.role, mfaEnabled: true }; next(); }
async function verifyTurnstile(token: string | undefined, ip: string | undefined) { const secret = process.env.TURNSTILE_SECRET_KEY; const previewPlaceholder = secret === 'AI_STUDIO_PREVIEW_DISABLED'; if (process.env.NODE_ENV !== 'production' && (!secret || previewPlaceholder)) return true; if (!token) return false; const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret, response: token, remoteip: ip }) }); return (await response.json() as { success?: boolean }).success === true; }
export function audit(req: AdminRequest, action: string, target = '') { db.prepare('INSERT INTO audit_log(admin_id, action, target, ip, user_agent, created_at) VALUES(?,?,?,?,?,?)').run(req.admin?.id ?? null, action, target, req.ip, req.get('user-agent')?.slice(0, 300) || '', new Date().toISOString()); }
export function consumeRateLimit(rateKey: string, limit: number, windowMs: number) { const now = Date.now(); const row = db.prepare('SELECT count, reset_at FROM rate_limits WHERE rate_key=?').get(rateKey) as any; const next = !row || row.reset_at <= now ? { count: 1, resetAt: now + windowMs } : { count: row.count + 1, resetAt: row.reset_at }; db.prepare('INSERT INTO rate_limits(rate_key,count,reset_at) VALUES(?,?,?) ON CONFLICT(rate_key) DO UPDATE SET count=excluded.count, reset_at=excluded.reset_at').run(rateKey, next.count, next.resetAt); return { allowed: next.count <= limit, retryAfterMs: Math.max(0, next.resetAt - now) }; }
export function resetRateLimit(rateKey: string) { db.prepare('DELETE FROM rate_limits WHERE rate_key=?').run(rateKey); }
export async function loginAdmin(username: string, password: string, turnstileToken: string | undefined, ip: string | undefined, res: Response) { if (!(await verifyTurnstile(turnstileToken, ip))) return { success: false, error: 'اعتبارسنجی CAPTCHA ناموفق بود.' }; const admin = db.prepare('SELECT * FROM admins WHERE username=?').get(username.trim()) as any; if (!admin || !bcrypt.compareSync(password, admin.password_hash)) return { success: false, error: 'نام کاربری یا رمز عبور نادرست است.' }; issueSession(admin.id, res, !admin.mfa_enabled); return { success: true, mfaRequired: Boolean(admin.mfa_enabled) }; }
export async function verifyMfaSession(req: AdminRequest, token: string) {
  const row = sessionRow(req); if (!row || !row.mfa_enabled) return false;
  const admin = db.prepare('SELECT mfa_secret FROM admins WHERE id=?').get(req.admin?.id) as any;
  let valid = false;
  if (/^\d{6}$/.test(token) && admin?.mfa_secret) {
    try { const result = await verify({ secret: admin.mfa_secret, token }); valid = typeof result === 'boolean' ? result : result.valid; } catch { valid = false; }
  }
  if (!valid) {
    const codeHash = hashRecoveryCode(token);
    const recovery = db.prepare('SELECT id FROM mfa_recovery_codes WHERE admin_id=? AND code_hash=? AND used_at IS NULL').get(req.admin?.id, codeHash) as any;
    if (recovery) { db.prepare('UPDATE mfa_recovery_codes SET used_at=? WHERE id=?').run(new Date().toISOString(), recovery.id); valid = true; audit(req, 'mfa_recovery_used'); }
  }
  if (!valid) return false;
  db.prepare('UPDATE sessions SET mfa_verified=1 WHERE id_hash=?').run(hashToken(req.cookies.toyooran_admin_session)); return true;
}
export function logoutAdmin(req: AdminRequest, res: Response) { const token = req.cookies?.toyooran_admin_session; if (token) db.prepare('DELETE FROM sessions WHERE id_hash=?').run(hashToken(token)); audit(req, 'logout'); res.clearCookie('toyooran_admin_session', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' }); }
export function changePassword(req: AdminRequest, oldPassword: string, newPassword: string) { if (newPassword.length < 16) return false; const row = db.prepare('SELECT password_hash FROM admins WHERE id=?').get(req.admin?.id) as any; if (!row || !bcrypt.compareSync(oldPassword, row.password_hash)) return false; const history = db.prepare('SELECT password_hash FROM password_history WHERE admin_id=? ORDER BY id DESC LIMIT 5').all(req.admin?.id) as any[]; if (history.some(item => bcrypt.compareSync(newPassword, item.password_hash)) || bcrypt.compareSync(newPassword, row.password_hash)) return false; const nextHash = bcrypt.hashSync(newPassword, 12); db.prepare('INSERT INTO password_history(admin_id,password_hash,created_at) VALUES(?,?,?)').run(req.admin?.id, row.password_hash, new Date().toISOString()); db.prepare('UPDATE admins SET password_hash=? WHERE id=?').run(nextHash, req.admin?.id); db.prepare('DELETE FROM sessions WHERE admin_id=?').run(req.admin?.id); audit(req, 'change_password'); return true; }
export function listSessions(req: AdminRequest) { return db.prepare('SELECT created_at, expires_at FROM sessions WHERE admin_id=? ORDER BY created_at DESC').all(req.admin?.id); }
export function revokeAllSessions(req: AdminRequest) { db.prepare('DELETE FROM sessions WHERE admin_id=?').run(req.admin?.id); }
export function getAdminState(key: string) { const row = db.prepare('SELECT state_json FROM admin_state WHERE state_key=?').get(key) as any; return row ? JSON.parse(row.state_json) : null; }
export function setAdminState(req: AdminRequest, key: string, value: unknown) { db.prepare('INSERT INTO admin_state(state_key,state_json,updated_at) VALUES(?,?,?) ON CONFLICT(state_key) DO UPDATE SET state_json=excluded.state_json, updated_at=excluded.updated_at').run(key, JSON.stringify(value), new Date().toISOString()); audit(req, 'state_update', key); }
export function startMfaSetup(adminId: number) {
  const secret = generateSecret();
  const recoveryCodes = Array.from({ length: 10 }, () => { const raw = crypto.randomBytes(10).toString('hex').toUpperCase(); return `${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15)}`; });
  db.prepare('UPDATE admins SET mfa_secret=?, mfa_enabled=0 WHERE id=?').run(secret, adminId);
  db.prepare('DELETE FROM mfa_recovery_codes WHERE admin_id=?').run(adminId);
  const insert = db.prepare('INSERT INTO mfa_recovery_codes(admin_id,code_hash,created_at) VALUES(?,?,?)');
  for (const code of recoveryCodes) insert.run(adminId, hashRecoveryCode(code), new Date().toISOString());
  return { secret, uri: generateURI({ issuer: 'Toyooran', label: 'admin', secret }), recoveryCodes };
}
export async function confirmMfa(adminId: number, token: string) { const row = db.prepare('SELECT mfa_secret FROM admins WHERE id=?').get(adminId) as any; if (!row?.mfa_secret || !/^\d{6}$/.test(token)) return false; const result = await verify({ secret: row.mfa_secret, token }); const valid = typeof result === 'boolean' ? result : result.valid; if (!valid) return false; db.prepare('UPDATE admins SET mfa_enabled=1 WHERE id=?').run(adminId); return true; }
export function createCsrfToken(res: Response) { const token = crypto.randomBytes(32).toString('base64url'); res.cookie('toyooran_csrf', token, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: SESSION_TTL_SECONDS * 1000, path: '/' }); return token; }
export function verifyCsrf(req: Request) { const cookie = req.cookies?.toyooran_csrf; const header = req.get('x-csrf-token'); if (!cookie || !header || cookie.length !== header.length) return false; return crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(header)); }
