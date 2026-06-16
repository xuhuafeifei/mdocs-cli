# mdocs-cli

mdocs Markdown 知识库的 CLI 客户端。

零依赖，单文件 Node.js（built-in `fetch`，Node 18+），通过 HTTP 调用 mdocs 的 REST API。

## 快速开始

```bash
# 1. 设置认证
export MDOCS_TOKEN="从 mdocs 设置页创建的 CLI Token"

# 2. 搜索文章
node mdocs.mjs search --q "关键词"

# 3. 读取文章
node mdocs.mjs get <文档ID>

# 4. 列出某域下所有文档
node mdocs.mjs list --domain <域ID>
node mdocs.mjs list --domainName <域名>

# 5. 创建文章
#   方式 A：指定参考文档，创建在同级目录
node mdocs.mjs create <参考文档ID> --name "笔记.md" --title "标题" --content "正文"
#   方式 B：不指定位置，默认写到私域根目录
node mdocs.mjs create --name "笔记.md" --title "标题" --content "正文"

# 6. 创建目录
node mdocs.mjs mkdir --domain <域ID> --name "目录名"
```

## 环境变量与全局参数

| 来源 | Token | 服务端 |
|------|-------|--------|
| **入参（优先）** | `--token <token>` **必填其一** | `--ip <host[:port]\|url>` 可选 |
| **环境变量** | `MDOCS_TOKEN` | `MDOCS_SERVER` |
| **默认** | — | `http://127.0.0.1:4000` |

`--ip` 示例：`101.132.222.88:4000`、`http://101.132.222.88:4000`；仅 host 时默认端口 `4000`。

全局选项可放在命令前或后，例如：

```bash
node mdocs.mjs --token xxx --ip 101.132.222.88:4000 domains
node mdocs.mjs domains --token xxx --ip 101.132.222.88:4000
```

## 命令

| 命令 | 说明 | 后端 API |
|------|------|----------|
| `search` | 全文检索 | `POST /api/documents/search` |
| `get` | 读取文档内容 | `GET /api/documents/:id` |
| `list` | 列出某域下所有文档 | `GET /api/documents?domainId=xxx&domainName=xxx` |
| `create` | 创建文档 | `POST /api/documents` |
| `mkdir` | 创建目录 | `POST /api/folders` |

## 代理输出格式

所有命令输出统一 JSON：

```json
{"ok": true, "data": ...}
{"ok": false, "error": "错误描述"}
```

成功 exit 0，失败 exit 1。

## 分发 Skill 到 Agent

```bash
./distribute-skill.sh              # 分发到所有 agent
./distribute-skill.sh deepseek     # 只分发到 deepseek
./distribute-skill.sh claude       # 只分发到 claude
```

会自动复制 `SKILL.md` 到对应 agent 的 skills 目录（如 `~/.deepseek/skills/mdoc-cli/`）。
