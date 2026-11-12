// Search the client build, the repo and its history for secrets; prints names only, never values
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const roots = [".next/static", "public"];
const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(js|css|html|json|txt|map)$/.test(p)) files.push(p);
  }
};
roots.filter(existsSync).forEach(walk);
// Prerendered HTML and RSC payloads also reach the browser
const server = ".next/server/app";
if (existsSync(server)) {
  const w = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) w(p);
      else if (/\.(html|rsc|body)$/.test(p)) files.push(p);
    }
  };
  w(server);
}

const SECRET_NAMES = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL", "RESEND_AUDIENCE_ID", "BLOB_READ_WRITE_TOKEN", "SANITY_API_WRITE_TOKEN", "SANITY_API_READ_TOKEN"];
// Addresses are private settings, not credentials: reported, not failed
const ADDRESSES = new Set(["CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"]);
const values = new Map();
for (const envFile of [".env.local", ".env", ".env.production"]) {
  if (!existsSync(envFile)) continue;
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (m && SECRET_NAMES.includes(m[1]) && m[2].length >= 8) values.set(m[1], m[2]);
  }
}
for (const n of SECRET_NAMES) if (process.env[n] && process.env[n].length >= 8) values.set(n, process.env[n]);

const PATTERNS = [
  ["Resend key", /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{8,}/],
  ["Vercel Blob token", /vercel_blob_rw_[A-Za-z0-9]{10,}/],
  ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----\s*[A-Za-z0-9+/=]{40,}/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ["Stripe live key", /\b[sr]k_live_[A-Za-z0-9]{16,}\b/],
];

// Client build
const hits = [];
const notes = [];
for (const f of files) {
  const text = readFileSync(f, "utf8");
  // a name alone is library code reading the variable; only values and keys fail
  for (const n of SECRET_NAMES) if (text.includes(n)) notes.push(`${f}: mentions ${n}`);
  for (const [n, v] of values) if (text.includes(v)) (ADDRESSES.has(n) ? notes : hits).push(`${f}: contains the value of ${n}`);
  for (const [n, re] of PATTERNS) if (re.test(text)) hits.push(`${f}: looks like a ${n}`);
}
console.log(`scanned ${files.length} client files for ${SECRET_NAMES.length} secret names, ${values.size} secret values and ${PATTERNS.length} key patterns`);
if (notes.length) console.log(`note: ${notes.length} client file(s) mention a secret name or a contact address`);

// Tracked files and the whole git history (diffs only, not commit author lines)
const sh = (c) => execSync(c, { encoding: "utf8", maxBuffer: 1024 * 1024 * 1024 });
const repoNotes = [];
const tracked = sh("git ls-files")
  .split("\n")
  .filter((p) => p && !/\.(png|jpe?g|webp|avif|gif|ico|mp4|webm|woff2?|pdf|zip)$/i.test(p) && existsSync(p));
for (const p of tracked) {
  const t = readFileSync(p, "utf8");
  for (const [n, v] of values) if (t.includes(v)) (ADDRESSES.has(n) ? repoNotes : hits).push(`${p}: contains the value of ${n}`);
  for (const [n, re] of PATTERNS) if (re.test(t)) hits.push(`${p}: looks like a ${n}`);
}
if (sh("git ls-files .env .env.local .env.production").trim()) hits.push("an .env file is tracked");
const history = sh('git log -p --all --format= --no-color --no-ext-diff -- . ":(exclude)*.png" ":(exclude)*.jpg" ":(exclude)*.webp" ":(exclude)*.mp4" ":(exclude)*.webm" ":(exclude)package-lock.json"');
for (const [n, v] of values) if (history.includes(v)) (ADDRESSES.has(n) ? repoNotes : hits).push(`git history: contains the value of ${n}`);
for (const [n, re] of PATTERNS) if (re.test(history)) hits.push(`git history: looks like a ${n}`);
const commits = sh("git rev-list --all --count").trim();
console.log(`scanned ${tracked.length} tracked files and ${commits} commits of history`);
if (repoNotes.length) console.log(`note: ${repoNotes.join("; ")}`);

if (hits.length) {
  console.log(hits.slice(0, 30).join("\n"));
  process.exit(1);
}
console.log("OK: no keys or tokens in the client build, the repo or its history");
