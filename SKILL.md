# Skills 已拆分

本仓库的 Agent Skill 位于 `skills/` 目录：

| Skill | 路径 | 用途 |
|-------|------|------|
| **mdocs-cli** | [skills/mdocs-cli/SKILL.md](./skills/mdocs-cli/SKILL.md) | mdocs HTTP CLI（search / get / create / update …） |
| **mdocs-dev** | [skills/mdocs-dev/SKILL.md](./skills/mdocs-dev/SKILL.md) | `.mdocs-docs` 开发契约（需求分析、设计门控、map） |

## 分发到本地 Agent

```bash
./distribute-skill.sh              # 默认：claude cursor deepseek kimi qwen
./distribute-skill.sh cursor claude  # 指定 agent
```

会将 **全部 skill** 复制到 `~/.<agent>/skills/<skill-name>/SKILL.md`。
