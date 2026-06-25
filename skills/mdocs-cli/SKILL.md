---
name: mdocs-cli
description: 通过 Node.js CLI 调用 mdocs 的搜索/读取/创建/更新接口，输出统一 JSON，供本地 Agent 使用。
---

# 用途与边界

- 调用 **mdocs** Markdown 知识库的 HTTP API：搜索、读取、列出、创建、更新文档与目录。
- CLI 只做薄封装，认证走 `x-cli-token` header。
- **开发契约**（`.mdocs-docs`、需求分析、设计门控）见 **`mdocs-dev` skill**；本 skill 仅负责 CLI。

# 固定目录

| 项 | 路径 |
|----|------|
| 仓库 | `https://github.com/xuhuafeifei/mdocs-cli.git` |
| 运行时 | `~/.mdocs-cli` |
| CLI 入口 | `~/.mdocs-cli/mdocs.mjs` |

# Agent 必做：准备运行时

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

1. **`MDOCS_TOKEN`**（必填）：mdocs 设置页创建 CLI Token → `export MDOCS_TOKEN=xxx`
2. **`MDOCS_SERVER`**（可选）：默认 `http://127.0.0.1:4000`
3. **Node.js 18+**

Token 失效：告知用户去设置页重建；**不要**自行注册访客拿 token。

# 调用方式

```bash
node ~/.mdocs-cli/mdocs.mjs <command> [args]
```

# 命令速查

| 命令 | 用途 |
|------|------|
| `domains` | 列出可访问域 |
| `search --q <词> [--domain <id>] [--topn <n>]` | 全文检索 |
| `get <文档ID>` | 读取文档（含 `headCommitId` 等元数据） |
| `list [--domain <id>] [--domainName <名>]` | 列出域内文档 |
| `ls <documentId>` | 列出目录下子节点 |
| `mkdir --domain <id> --name <名> [--parent <id>]` | 创建目录 |
| `create --domain <id> --parent <目录ID> --name <文件.md> [--file <路径>] [--content <正文>]` | 创建文档 |
| `create <参考文档ID> --name ... [--file ...]` | 在参考文档同级创建 |
| `update <文档ID> [--file <路径>] [--content <正文>] [--title <标题>]` | 更新（默认乐观锁） |

## create 说明

- **优先**：`--domain` + `--parent`（先 `get` / `ls` 确认 `fileType === 'dir'`）
- `--file` 与 `--content` 二选一
- 未指定位置时默认写到当前用户私域根目录

## update 说明

- 默认 `GET` 拿 `headCommitId`，PUT 带 `version.baseCommitId`
- 冲突：`[VERSION_CONFLICT]`，需在 Web 合并或处理后再推
- `--skip-version-check`：跳过乐观锁（慎用）
- `--base <commitId>`：手动指定 base
- 高级 merge：`--merge --base ... --expected-head ... [--local-snapshot ...]`

## ls 说明

- 无路径参数；传文章 ID 会列其父目录同级内容
- 传目录 ID 列该目录直接子节点
- 输出含 `documentId`、`fileType`、`domainId`、`parentId`

# 输出协议

```json
{"ok": true, "data": ...}
{"ok": false, "error": "...", "code": "VERSION_CONFLICT", "details": {...}}
```

成功 exit 0，失败 exit 1。

# URL 意图

| 用户意图 | 动作 |
|----------|------|
| 修改该文档 | `update <文档ID>` |
| 在该目录下新建 | 确认目录 → `create --domain ... --parent <id> ...` |
| 给文章 URL 但要新建同级 | `create <参考文档ID> ...` |
| 不确定 | 问用户 |

# 建议工作流

1. `search` → 拿文档 ID
2. `get <id>` → 读正文与元数据
3. 创建：有目录 ID → `--domain` + `--parent`；否则按 URL 规则
4. 从本地推送：`update <id> --file .mdocs-docs/...` 或 `create ... --file ...`（配合 **mdocs-dev** 契约目录）
