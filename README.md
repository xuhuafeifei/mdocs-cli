# mdocs-cli

mdocs Markdown 知识库的 CLI 客户端 + Agent Skills。

- **CLI**：零依赖单文件 `mdocs.mjs`，HTTP 调用 mdocs REST API。
- **Skills**（`skills/`）：
  - **mdocs-cli** — 命令行调用 mdocs API
  - **mdocs-dev** — 项目内 `.mdocs-docs` 开发契约（人审设计后再写代码）

## 快速开始

```bash
# 1. 克隆到本地（Agent 运行时目录）
git clone https://github.com/xuhuafeifei/mdocs-cli.git ~/.mdocs-cli

# 2. 设置认证
export MDOCS_TOKEN="从 mdocs 设置页创建的 CLI Token"

# 3. 搜索文章
node ~/.mdocs-cli/mdocs.mjs search --q "关键词"

# 4. 读取文章
node ~/.mdocs-cli/mdocs.mjs get <文档ID>
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

| 命令 | 说明 |
|------|------|
| `search` | 全文检索 |
| `get` | 读取文档 |
| `list` | 列出域内文档 |
| `ls` | 列出目录子节点 |
| `create` | 创建文档 |
| `update` | 更新文档（乐观锁） |
| `mkdir` | 创建目录 |
| `domains` | 列出域 |

详见 [skills/mdocs-cli/SKILL.md](./skills/mdocs-cli/SKILL.md)。

## 分发 Skills 到 Agent

```bash
./distribute-skill.sh              # 默认 agent：claude cursor deepseek kimi qwen
./distribute-skill.sh cursor       # 只分发到 cursor
```

一次分发 **skills/ 下全部 skill**（`mdocs-cli` + `mdocs-dev`）到 `~/.<agent>/skills/<skill-name>/`。

## 仓库结构

```
mdocs-cli/
├── mdocs.mjs
├── skills/
│   ├── mdocs-cli/SKILL.md    # CLI 专用
│   └── mdocs-dev/SKILL.md    # 开发契约
├── distribute-skill.sh
└── README.md
```
