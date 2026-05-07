---
name: mdocs-cli
description: 通过 Node.js CLI 调用 mdocs 的搜索/读取/创建/更新接口，输出统一 JSON，供本地 agent 使用。
---

# 用途与边界

- 该 skill 用于调用本地 **mdocs** Markdown 知识库的五项能力：关键词搜索、读取文章、创建文章、更新文章、创建目录。
- CLI 只做 HTTP 薄封装，请求通过 `x-cli-token` header 认证。
- 本 skill 的 CLI 入口固定在 `~/.mdocs-cli/mdocs.mjs`（见下文分发流程）。

# 固定目录

- **仓库地址**：`https://github.com/xuhuafeifei/mdocs-cli.git`
- **运行时目录（写死）**：`~/.mdocs-cli`
- **CLI 入口（写死）**：`~/.mdocs-cli/mdocs.mjs`

# Agent 必做：准备运行时

第一次调用前，确保仓库已克隆到 `~/.mdocs-cli`：

```bash
DST="${HOME}/.mdocs-cli"
REPO_URL="https://github.com/xuhuafeifei/mdocs-cli.git"
if [[ -d "${DST}/.git" ]]; then
  git -C "${DST}" pull --rebase
elif [[ -e "${DST}" ]]; then
  echo "error: ${DST} 存在但不是 git 仓库，请用户处理" >&2
  exit 1
else
  git clone "${REPO_URL}" "${DST}"
fi
```

# 前置条件

1. **环境变量 `MDOCS_TOKEN`**：用户需在 mdocs 设置页创建 CLI Token，然后 `export MDOCS_TOKEN=xxx`。
2. **mdocs 服务端在运行**：默认地址 `http://127.0.0.1:4000`，可通过 `MDOCS_SERVER` 覆盖。
3. **Node.js 18+**：built-in `fetch`，零依赖。

# 调用方式

```bash
node ~/.mdocs-cli/mdocs.mjs <command> [args]
```

# 命令速查

## 搜索文章

```bash
node ~/.mdocs-cli/mdocs.mjs search --q "关键词" [--domain <域ID>] [--topn <数量>]
```

全文检索，结果按 BM25 相关性排序，自动过滤无权阅读的文档。

## 读取文章

```bash
node ~/.mdocs-cli/mdocs.mjs get <文档ID>
```

返回文档完整内容（含正文、路径、权限等元数据）。

## 创建文章

```bash
node ~/.mdocs-cli/mdocs.mjs create --name "笔记.md" --title "标题" --content "正文" [--domain <域ID>] [--parent <父目录ID>]
node ~/.mdocs-cli/mdocs.mjs create --name "笔记.md" --title "标题" --file /tmp/content.md [--domain <域ID>] [--parent <父目录ID>]
```

- `--name`：文件名（必填），如 `笔记.md`。路径由后端根据 `--parent` 自动计算
- `--domain`：域 ID（可选，不传时使用当前访客的个人域）
- `--title`：展示标题（可选，默认用文件名）
- `--content`：正文（与 `--file` 二选一）
- `--file`：从文件读正文
- `--parent`：父目录 ID（可选，不传则放在域顶层）

## 更新文章

```bash
node ~/.mdocs-cli/mdocs.mjs update <文档ID> --content "新正文" [--title "新标题"]
node ~/.mdocs-cli/mdocs.mjs update <文档ID> --file /tmp/content.md [--title "新标题"]
```

- `--content`：新正文（与 `--file` 二选一）
- `--file`：从文件读正文
- `--title`：新展示标题（可选）

## 创建目录

```bash
node ~/.mdocs-cli/mdocs.mjs mkdir --domain <域ID> --name "目录名" [--parent <父目录ID>]
```

# 输出协议

所有命令 stdout 输出统一 JSON：

```json
{"ok": true, "data": ...}
{"ok": false, "error": "错误描述"}
```

成功时 exit code 0，失败时 exit code 1。

# 建议工作流

1. 确保 `MDOCS_TOKEN` 已设置，mdocs 服务端在运行。
2. `search` 搜索关键词 → 拿到文档 ID。
3. `get <id>` 读取文档正文。
4. `create` 或 `mkdir` 写入新内容（先问用户要写到哪个域，不要猜）。
5. `update <id>` 更新已有文章内容。
