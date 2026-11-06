import { getArticles, getCaseStudies } from "@/lib/content";
import { SERVICES, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// llms.txt
export async function GET() {
  const articles = await getArticles();
  const cases = await getCaseStudies();
  const lines = [
    "# Corevex Solutions",
    "",
    "> PSEB registered software company founded in 2022 with 50+ engineers. Custom software, full stack development, code rescue for AI-built apps, SaaS app development, mobile apps (React Native, Flutter), AI and LLM development, AI automation and AI Agents as a Service (AaaS).",
    "",
    "## Leadership",
    "- Mazhar H, CEO and Founder",
    "- M Azhar, Co-founder and Solution Architect",
    "- Zafar H, Chief Operating Officer",
    "",
    "## Pages",
    ...["/services/", "/work/", "/ai-lab/", "/about/", "/careers/", "/insights/", "/faq/", "/contact/"].map((p) => `- ${SITE_URL}${p}`),
    "",
    "## Services",
    ...SERVICES.map((s) => `- [${s.name}](${SITE_URL}/services/${s.slug}/): ${s.blurb}`),
    "",
    "## Insights",
    ...articles.map((a) => `- [${a.title}](${SITE_URL}/insights/${a.slug}/)`),
    "",
    "## Product design studies",
    ...cases.map((c) => `- [${c.name}](${SITE_URL}/work/${c.slug}/): ${c.summary}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
