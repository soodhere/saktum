// Refreshes market-data.json with public ecosystem measurements. Run daily by .github/workflows/refresh-data.yml.
// Sources: GitHub search (topic:mcp-server), npm registry search, npm package metadata. No private data, no scraping.
import { readFileSync, writeFileSync } from "node:fs";

const get = async (url, headers = {}) => {
  const r = await fetch(url, { headers: { "User-Agent": "saktum-market-data", ...headers } });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
};
const gh = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json" } : { Accept: "application/vnd.github+json" };

const prev = (() => { try { return JSON.parse(readFileSync("market-data.json", "utf8")); } catch { return null; } })();
const prevRepos = prev?.metrics?.find((m) => m.key === "githubRepos");

const repos = (await get("https://api.github.com/search/repositories?q=topic:mcp-server&per_page=1", gh)).total_count;
const npmMcp = (await get("https://registry.npmjs.org/-/v1/search?text=keywords:mcp&size=1")).total;
const npmServer = (await get("https://registry.npmjs.org/-/v1/search?text=keywords:mcp-server&size=1")).total;
const sdk = await get("https://registry.npmjs.org/@modelcontextprotocol%2fsdk");
const sdkReleases = Object.keys(sdk.time).filter((k) => k !== "created" && k !== "modified").length;
const today = new Date().toISOString().slice(0, 10);

const data = {
  asOf: today,
  metrics: [
    { key: "githubRepos", value: repos, label: "GitHub repositories tagged mcp-server", source: "GitHub search: topic:mcp-server", url: "https://github.com/topics/mcp-server" },
    ...(prevRepos && prev.asOf !== today ? [{ key: "githubReposPrev", value: prevRepos.value, label: `The same count on ${prev.asOf}`, source: "Previous daily snapshot", url: "https://github.com/topics/mcp-server" }] : prev?.metrics?.filter((m) => m.key === "githubReposPrev") ?? []),
    { key: "npmMcp", value: npmMcp, label: "npm packages with the keyword mcp", source: "npm registry search: keywords:mcp", url: "https://www.npmjs.com/search?q=keywords%3Amcp" },
    { key: "npmMcpServer", value: npmServer, label: "npm packages with the keyword mcp-server", source: "npm registry search: keywords:mcp-server", url: "https://www.npmjs.com/search?q=keywords%3Amcp-server" },
    { key: "sdkReleases", value: sdkReleases, label: `Releases of the official TypeScript SDK since ${sdk.time.created.slice(0, 10)}`, source: "npm registry: @modelcontextprotocol/sdk", url: "https://www.npmjs.com/package/@modelcontextprotocol/sdk" },
    { key: "fieldTest", value: "6 of 14", label: "Popular servers declaring no danger hints in our field test", source: "Saktum field test of 19 public servers, October 2026", url: "" }
  ]
};
writeFileSync("market-data.json", JSON.stringify(data, null, 2) + "\n");
console.log(`market-data.json updated for ${today}: ${repos} repos, ${npmMcp} npm mcp packages`);
