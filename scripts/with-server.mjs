// Run a command against a local production server in test mode
import { spawn } from "node:child_process";

const PORT = 3100;
const URL = `http://localhost:${PORT}/`;
const cmd = process.argv.slice(2).join(" ");
if (!cmd) {
  console.error("usage: node scripts/with-server.mjs <command>");
  process.exit(2);
}

const up = async () => {
  try {
    return (await fetch(URL)).ok;
  } catch {
    return false;
  }
};

let server = null;
if (!(await up())) {
  server = spawn("npx", ["next", "start", "-p", String(PORT)], { shell: true, stdio: "ignore", env: { ...process.env, TEST_MODE: "true" } });
  for (let i = 0; i < 120 && !(await up()); i++) await new Promise((r) => setTimeout(r, 500));
  if (!(await up())) {
    console.error("server did not start");
    process.exit(1);
  }
}

const child = spawn(cmd, { shell: true, stdio: "inherit" });
child.on("exit", (code) => {
  if (server) {
    if (process.platform === "win32") spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    else server.kill("SIGTERM");
  }
  process.exit(code ?? 1);
});
