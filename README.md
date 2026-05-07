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

# 4. 创建文章
node mdocs.mjs create --domain <域ID> --path "笔记/xxx.md" --title "标题" --content "正文"

# 5. 创建目录
node mdocs.mjs mkdir --domain <域ID> --name "目录名"
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MDOCS_TOKEN` | — | **必填**。CLI Token，在 mdocs 设置页创建 |
| `MDOCS_SERVER` | `http://127.0.0.1:4000` | mdocs 服务端地址 |

## 命令

| 命令 | 说明 | 后端 API |
|------|------|----------|
| `search` | 全文检索 | `POST /api/documents/search` |
| `get` | 读取文档内容 | `GET /api/documents/:id` |
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
