import { currentBrand } from "@/lib/brand";

const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "Grok",
  "xAI-Bot",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
];

export async function GET() {
  const brand = await currentBrand();
  if (!brand.strictRobots) return new Response("Not found", { status: 404 });
  const body = `${AI_AGENTS.map((agent) => `User-agent: ${agent}\nDisallow: /\n`).join("\n")}\nUser-agent: *\nAllow: /\n`;
  return new Response(body, { headers: { "content-type": "text/plain" } });
}
