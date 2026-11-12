// k6 load test, local production build only (TEST_MODE mocks Resend)
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.LOAD_BASE || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) throw new Error("Refusing to load test anything but a local server");

export const options = {
  scenarios: {
    pages: {
      executor: "constant-vus",
      vus: 50,
      duration: __ENV.LOAD_DURATION || "2m",
      exec: "pages",
    },
    contact_burst: {
      executor: "constant-arrival-rate",
      rate: 20,
      timeUnit: "1s",
      duration: "20s",
      preAllocatedVUs: 20,
      maxVUs: 40,
      startTime: "30s",
      exec: "contact",
    },
  },
  thresholds: {
    "http_req_duration{scenario:pages}": ["p(95)<500"],
    "http_req_duration{scenario:contact_burst}": ["p(95)<500"],
    http_req_failed: ["rate==0"],
    checks: ["rate==1"],
  },
  summaryTrendStats: ["avg", "min", "med", "p(90)", "p(95)", "p(99)", "max"],
};

const PAGES = ["/", "/services/custom-software-development/"];

export function pages() {
  for (const p of PAGES) {
    const r = http.get(`${BASE}${p}`, { tags: { page: p } });
    check(r, { "page 200": (x) => x.status === 200 });
  }
  sleep(1);
}

let n = 0;
export function contact() {
  n++;
  // A different visitor each time, so the per-address limit does not apply
  const ip = `10.${__VU % 250}.${n % 250}.${(__ITER + 1) % 250}`;
  const r = http.post(
    `${BASE}/api/forms/contact/`,
    { name: "Load Test", email: `load-${__VU}-${__ITER}@example.com`, details: "Load test enquiry.", need: "Web app", t: String(Date.now() - 10000) },
    { headers: { "x-forwarded-for": ip } },
  );
  check(r, { "contact 200": (x) => x.status === 200 });
}

export function handleSummary(data) {
  const m = (k) => data.metrics[k]?.values;
  const out = {
    pages: m("http_req_duration{scenario:pages}"),
    contact: m("http_req_duration{scenario:contact_burst}"),
    failed: m("http_req_failed"),
    requests: m("http_reqs"),
    checks: m("checks"),
  };
  return { "test-results/load/k6-summary.json": JSON.stringify(out, null, 2), stdout: JSON.stringify(out, null, 2) + "\n" };
}
