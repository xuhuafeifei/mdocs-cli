---
name: mdocs-cli
description: 通过 Node.js CLI 调用 mdocs 的搜索/读取/创建/更新接口，输出统一 JSON，供本地 agent 使用。
---

# 用途与边界

- 该 skill 用于调用本地 **mdocs** Markdown 知识库的六项能力：关键词搜索、读取文章、列出某域下所有文档、创建文章、更新文章、创建目录。
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

# Token 失效处理

当调用 CLI 返回 `INVALID_TOKEN` 或 `MDOCS_TOKEN 未设置` 错误时：

1. 先检查 `echo $MDOCS_TOKEN` 是否为空，如果为空则主动问用户要 token
2. 如果 token 已设置但仍报 `INVALID_TOKEN`，说明 token 已过期或被吊销，主动告知用户需要去 mdocs 设置页重新创建 CLI Token
3. 拿到新 token 后，让用户 `export MDOCS_TOKEN=xxx` 或直接在命令前内联

**不要自行通过 API 注册访客拿 token**，token 需要用户在 mdocs 设置页手动创建。

# 调用方式

```bash
node ~/.mdocs-cli/mdocs.mjs <command> [args]
```

# 命令速查

## 列出现有域

```bash
node ~/.mdocs-cli/mdocs.mjs domains
```

返回当前 token 有权限访问的所有域。用于确定创建文章时传给 `--domain` 的域 ID。

## 搜索文章

```bash
node ~/.mdocs-cli/mdocs.mjs search --q "关键词" [--domain <域ID>] [--topn <数量>]
```

全文检索，结果按 BM25 相关性排序，自动过滤无权阅读的文档。

## 读取文章

```bash
node ~/.mdocs-cli/mdocs.mjs get <文档ID>
```

返回文档完整内容（纯文本格式，方便 AI 阅读），含元数据。

## 列出某域下所有文档

```bash
node ~/.mdocs-cli/mdocs.mjs list --domain <域ID>
node ~/.mdocs-cli/mdocs.mjs list --domainName <域名>
```

- `--domain`：域 ID（UUID），优先匹配
- `--domainName`：域名（字符串），后端按唯一名称解析
- 不传任何参数时列出默认域下的文档
- 自动过滤无权阅读的文档，返回扁平的 `DocumentSummary[]`（含 documentId、displayName、relativePath、permission 等）

## 创建文章

```bash
# 方式 A：指定参考文档，创建在同级目录
node ~/.mdocs-cli/mdocs.mjs create <参考文档ID> --name "笔记.md" --title "标题" --content "正文"

# 方式 B：不指定位置，默认写到当前用户的私域根目录
node ~/.mdocs-cli/mdocs.mjs create --name "笔记.md" --title "标题" --content "正文"
```

- `<参考文档ID>`：可选。指定后，新文档将创建在该文档的**同级目录**下；如果参考文档本身是目录，则创建在该目录内部。不指定时，默认写到当前用户的私域根目录
- `--name`：文件名（必填），如 `笔记.md`
- `--title`：展示标题（可选，默认用文件名）
- `--content`：正文（与 `--file` 二选一）
- `--file`：从文件读正文
- `--permission`：权限档位（可选）

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

## 列出目录下的文章

```bash
# 方式1：按文档ID（推荐，点目录树拿到的就是 ___desc___.md 的ID）
node ~/.mdocs-cli/mdocs.mjs ls <documentId>

# 方式2：按文件名搜索（需要指定域）
node ~/.mdocs-cli/mdocs.mjs ls "文件名关键词" --domain <域ID>
```

**与 shell ls 的核心区别**：
- 不支持路径参数（没有 `/a/b/c` 这种路径写法）
- 不管传的是目录本身还是目录下的某篇文章，最终都是**列出该目录下的所有直接子节点**
- 如果传的是普通文章 → 自动找它的父目录，列出同级内容
- 如果传的是目录（`fileType === 'dir'`）→ 直接列出该目录下的内容

**输出**：目录下所有子节点的数组（含文件夹和文档），每个节点带 `documentId`、`displayName`、`fileType`、`parentId` 等字段。

# 输出协议

所有命令 stdout 输出统一 JSON：

```json
{"ok": true, "data": ...}
{"ok": false, "error": "错误描述"}
```

成功时 exit code 0，失败时 exit code 1。

# URL 意图判断规则

当用户给出 `http://localhost:5173/doc/<文档ID>` 链接时：

1. **判断标准**：
   - 如果用户说"写入"/"修改"/"更新"这篇文章 → 用 `update <文档ID>`
   - 如果用户说"创建"/"新建"一篇文章 → 用 `create <文档ID>`（CLI 会自动将其挂载到该文档的同级目录；若该文档是目录，则挂载到目录内部）
2. **不确定时，先问用户意图**

当用户只说"创建一篇文章"而没有给出任何文档链接时：
- 直接用 `create --name "xxx.md" ...`，CLI 会自动将其写到当前用户的私域根目录

# 建议工作流

1. 确保 `MDOCS_TOKEN` 已设置，mdocs 服务端在运行。
2. `search` 搜索关键词 → 拿到文档 ID。
3. `get <id>` 读取文档正文。
4. `list --domainName <name>` 列出某域下所有文档。
5. `create` 或 `mkdir` 写入新内容（先问用户要写到哪个域，不要猜）。
6. `update <id>` 更新已有文章内容。
