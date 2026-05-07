#!/usr/bin/env node
/**
 * mdocs — mdocs CLI client
 *
 * 4 个命令：search, get, create, mkdir
 *
 * Usage:
 *   export MDOCS_TOKEN="xxx"
 *   node mdocs.mjs search --q "关键词" [--domain <id>] [--topn <n>]
 *   node mdocs.mjs get <document-id>
 *   node mdocs.mjs create --domain <id> --path "笔记/xxx.md" --title "标题" --content "正文"
 *   node mdocs.mjs create --domain <id> --path "笔记/xxx.md" --title "标题" --file /tmp/content.md
 *   node mdocs.mjs mkdir --domain <id> --name "目录名"
 */

const TOKEN = process.env.MDOCS_TOKEN;
const SERVER = (process.env.MDOCS_SERVER || "http://127.0.0.1:4000").replace(/\/+$/, "");

// ─── 简易参数解析 ───────────────────────────────────────────
function parseArgs(argv) {
  const args = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a?.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      args.push(a);
    }
  }
  return { args, flags };
}

// ─── HTTP 请求 ──────────────────────────────────────────────
async function api(method, path, body) {
  if (!TOKEN) {
    return { ok: false, error: "MDOCS_TOKEN 未设置，请先 export MDOCS_TOKEN=xxx" };
  }
  const url = `${SERVER}/api${path}`;
  const opts = {
    method,
    headers: { "x-cli-token": TOKEN },
  };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(url, opts);
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const err = json?.error;
      return { ok: false, error: err ? `[${err.code}] ${err.message}` : `HTTP ${res.status}` };
    }
    return { ok: true, data: json?.data };
  } catch (e) {
    return { ok: false, error: `请求失败: ${e.message}` };
  }
}

// ─── 命令：search ───────────────────────────────────────────
async function search(flags) {
  const q = flags.q || flags.query;
  if (!q) return { ok: false, error: "缺少 --q <关键词>" };
  return api("POST", "/documents/search", {
    query: q,
    domainId: flags.domain || undefined,
    topN: flags.topn ? Number(flags.topn) : undefined,
  });
}

// ─── 命令：get ──────────────────────────────────────────────
async function get(args) {
  const id = args[0];
  if (!id) return { ok: false, error: "缺少文档 ID" };
  return api("GET", `/documents/${encodeURIComponent(id)}`);
}

// ─── 命令：create ───────────────────────────────────────────
async function create(flags) {
  if (!flags.domain) return { ok: false, error: "缺少 --domain <域ID>" };
  if (!flags.path) return { ok: false, error: "缺少 --path <路径>" };

  let content = flags.content;
  if (flags.file) {
    const fs = await import("node:fs");
    content = fs.readFileSync(flags.file, "utf-8");
  }
  if (!content) return { ok: false, error: "缺少 --content <正文> 或 --file <路径>" };

  return api("POST", "/documents", {
    relativePath: flags.path,
    displayName: flags.title || undefined,
    content,
    domainId: flags.domain,
    parentId: flags.parent || undefined,
  });
}

// ─── 命令：mkdir ────────────────────────────────────────────
async function mkdir(flags) {
  if (!flags.domain) return { ok: false, error: "缺少 --domain <域ID>" };
  if (!flags.name) return { ok: false, error: "缺少 --name <目录名>" };
  return api("POST", "/folders", {
    name: flags.name,
    domainId: flags.domain,
    parentId: flags.parent || undefined,
  });
}

// ─── 入口 ───────────────────────────────────────────────────
async function main() {
  const { args, flags } = parseArgs(process.argv.slice(2));
  const cmd = args[0];

  let result;
  switch (cmd) {
    case "search": result = await search(flags); break;
    case "get":    result = await get(args.slice(1)); break;
    case "create": result = await create(flags); break;
    case "mkdir":  result = await mkdir(flags); break;
    default:
      result = {
        ok: false,
        error: `未知命令: ${cmd}\n支持: search, get, create, mkdir`,
      };
  }

  process.stdout.write(JSON.stringify(result) + "\n");
  if (!result.ok) process.exit(1);
}

main();
