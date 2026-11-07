// Search the client build for secrets; prints names only, never values
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

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
  ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----s*[A-Za-z0-9+/=]{40,}/],
];

const hits = [];
const notes = [];
for (const f of files) {
  const text = readFileSync(f, "utf8");
  // a name alone is library code reading the variable; only values and keys fail
  for (const n of SECRET_NAMES) if (text.includes(n)) notes.push(`${f}: mentions ${n}`);
  for (const [n, v] of values) if (text.includes(v)) hits.push(`${f}: contains the value of ${n}`);
  for (const [n, re] of PATTERNS) if (re.test(text)) hits.push(`${f}: looks like a ${n}`);
}
console.log(`scanned ${files.length} client files for ${SECRET_NAMES.length} secret names, ${values.size} secret values and ${PATTERNS.length} key patterns`);
if (notes.length) console.log(`note: ${notes.length} file(s) mention a secret name without its value`);
if (hits.length) {
  console.log(hits.slice(0, 30).join("\n"));
  process.exit(1);
}
console.log("OK: no secrets in the client build");
