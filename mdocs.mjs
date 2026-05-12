#!/usr/bin/env node
/**
 * mdocs — mdocs CLI client
 *
 * 7 个命令：search, get, create, update, list, domains, mkdir, ls
 *
 * Usage:
 *   export MDOCS_TOKEN="xxx"
 *   node mdocs.mjs search --q "关键词" [--domain <id>] [--topn <n>]
 *   node mdocs.mjs get <document-id> [--json]  # 默认返回纯文本，--json 返回 Lexical JSON
 *   node mdocs.mjs create <参考文档ID> --name "笔记.md" --title "标题" --content "正文"
 *   node mdocs.mjs create <参考文档ID> --name "笔记.md" --title "标题" --file /tmp/content.md
 *   node mdocs.mjs create --domain <域ID> --parent <目录ID> --name "笔记.md" --title "标题" --file /tmp/content.md
 *   node mdocs.mjs update <文档ID> --content "新正文" [--title "新标题"]
 *   node mdocs.mjs list [--domain <id>] [--domainName <name>]
 *   node mdocs.mjs domains
 *   node mdocs.mjs mkdir --domain <id> --name "目录名"
 *   node mdocs.mjs ls <documentId>
 *   node mdocs.mjs ls "文件名关键词" --domain <域ID>
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
  // CLI 默认返回纯文本，方便 AI 阅读
  return api("GET", `/documents/${encodeURIComponent(id)}?format=text`);
}

// ─── 命令：create ───────────────────────────────────────────
async function create(args, flags) {
  let domainId, parentId;

  // 优先使用命令行指定的 --domain 和 --parent
  if (flags.domain) {
    domainId = flags.domain;
    parentId = flags.parent || undefined;
  } else {
    const referenceDocId = args[0];
    if (referenceDocId) {
      // 有参考文档：查询它，自动推断 domainId 和 parentId
      const ref = await api("GET", `/documents/${encodeURIComponent(referenceDocId)}`);
      if (!ref.ok) return ref;

      const refDoc = ref.data;
      domainId = refDoc.domainId;
      // 如果参考文档是目录，新文档挂在这个目录下；否则挂在参考文档的同级目录
      parentId = refDoc.fileType === 'dir' ? refDoc.documentId : (refDoc.parentId || undefined);
    } else {
      // 没有参考文档：默认写到当前用户的私域根目录
      const me = await api("GET", "/visitors/me");
      if (!me.ok) return me;
      domainId = me.data.visitor.visitorId;
      parentId = undefined;
    }
  }

  const fileName = flags.name || flags.path;
  if (!fileName) return { ok: false, error: "缺少 --name <文件名>（如：笔记.md）" };

  let content = flags.content;
  if (flags.file) {
    const fs = await import("node:fs");
    content = fs.readFileSync(flags.file, "utf-8");
  }
  if (!content) return { ok: false, error: "缺少 --content <正文> 或 --file <路径>" };

  return api("POST", "/documents", {
    fileName,
    displayName: flags.title || undefined,
    content,
    domainId,
    permission: flags.permission ? Number(flags.permission) : undefined,
    parentId,
    contentFormat: 'markdown'
  });
}

// ─── 命令：update ───────────────────────────────────────────
async function update(args, flags) {
  const id = args[0];
  if (!id) return { ok: false, error: "缺少文档 ID" };

  const body = {};
  if (flags.content) body.content = flags.content;
  if (flags.file) {
    const fs = await import("node:fs");
    body.content = fs.readFileSync(flags.file, "utf-8");
  }
  if (flags.title) body.displayName = flags.title;
  if (flags.permission) body.permission = Number(flags.permission);
  if (!body.content && !body.displayName && body.permission === undefined) {
    return { ok: false, error: "缺少更新内容（--content, --file, --title 至少一个）" };
  }
  body.contentFormat = 'markdown'
  return api("PUT", `/documents/${encodeURIComponent(id)}`, body);
}

// ─── 命令：domains ─────────────────────────────────────────
async function domains() {
  return api("GET", "/domains");
}

// ─── 命令：list ─────────────────────────────────────────────
async function list(flags) {
  const params = new URLSearchParams();
  if (flags.domain) params.set("domainId", flags.domain);
  if (flags.domainName) params.set("domainName", flags.domainName);
  const qs = params.toString();
  return api("GET", `/documents${qs ? "?" + qs : ""}`);
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

// ─── 命令：ls ───────────────────────────────────────────────
async function ls(args, flags) {
  const target = args[0];
  if (!target) return { ok: false, error: "缺少参数：<documentId> 或 <文件名关键词>" };

  let doc;

  // 方式1：按文件名搜索（需要指定域）
  if (flags.domain || flags.domainName) {
    // 先列出域下所有文档，按 display_name 匹配
    const params = new URLSearchParams();
    if (flags.domain) params.set("domainId", flags.domain);
    if (flags.domainName) params.set("domainName", flags.domainName);
    const qs = params.toString();

    const listResult = await api("GET", `/documents${qs ? "?" + qs : ""}`);
    if (!listResult.ok) return listResult;

    // 匹配 display_name 或 relative_path
    const matched = listResult.data.find(d =>
      d.displayName?.includes(target) || d.relativePath?.includes(target)
    );
    if (!matched) {
      return { ok: false, error: `在指定域中未找到匹配 "${target}" 的文档` };
    }
    doc = matched;
  } else {
    // 方式2：直接按 documentId 查询
    const getResult = await api("GET", `/documents/${encodeURIComponent(target)}`);
    if (!getResult.ok) return getResult;
    doc = getResult.data;
  }

  // 确定要查询的目录ID
  let folderId;
  if (doc.fileType === 'dir') {
    // 是目录，直接查它的子节点
    folderId = doc.documentId;
  } else {
    // 是普通文章，查它的父目录
    folderId = doc.parentId;
    if (!folderId) {
      return { ok: false, error: "该文档在根目录下，没有父目录" };
    }
  }

  return api("GET", `/documents/folder/${encodeURIComponent(folderId)}/children`);
}

// ─── 入口 ───────────────────────────────────────────────────
async function main() {
  const { args, flags } = parseArgs(process.argv.slice(2));
  const cmd = args[0];

  let result;
  switch (cmd) {
    case "search": result = await search(flags); break;
    case "get":    result = await get(args.slice(1)); break;
    case "create": result = await create(args.slice(1), flags); break;
    case "update": result = await update(args.slice(1), flags); break;
    case "list":   result = await list(flags); break;
    case "domains": result = await domains(); break;
    case "mkdir":  result = await mkdir(flags); break;
    case "ls":     result = await ls(args.slice(1), flags); break;
    default:
      result = {
        ok: false,
        error: `未知命令: ${cmd}\n支持: search, get, create, update, list, domains, mkdir, ls`,
      };
  }

  process.stdout.write(JSON.stringify(result) + "\n");
  if (!result.ok) process.exit(1);
}

main();
