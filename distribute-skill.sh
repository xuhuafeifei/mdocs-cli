#!/usr/bin/env bash
#
# distribute-skill.sh — 将 skills/ 下全部 skill 分发到各 agent 目录
#
# Usage:
#   ./distribute-skill.sh [agent-name...]
#
# 无参数时默认分发到：claude cursor deepseek kimi qwen
#
# 规则: skills/<skill-name>/SKILL.md → ~/.<agent>/skills/<skill-name>/SKILL.md
#
# 示例:
#   ./distribute-skill.sh                    # 默认 agent 列表，分发 mdocs-cli + mdocs-dev
#   ./distribute-skill.sh cursor claude      # 指定 agent

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="${SCRIPT_DIR}/skills"

if [[ ! -d "${SKILLS_DIR}" ]]; then
  echo "error: 找不到 ${SKILLS_DIR}" >&2
  exit 1
fi

# 收集 skills/*/SKILL.md
skill_names=()
while IFS= read -r -d '' skill_md; do
  skill_dir="$(dirname "${skill_md}")"
  skill_names+=("$(basename "${skill_dir}")")
done < <(find "${SKILLS_DIR}" -mindepth 2 -maxdepth 2 -name 'SKILL.md' -print0 | sort -z)

if [[ ${#skill_names[@]} -eq 0 ]]; then
  echo "error: ${SKILLS_DIR} 下没有 skill（需要 skills/<name>/SKILL.md）" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  set -- claude cursor deepseek kimi qwen
fi

echo "将分发 ${#skill_names[@]} 个 skill: ${skill_names[*]}"
echo "目标 agent: $*"
echo

ok=0
fail=0

copy_skill() {
  local src="$1"
  local dst="$2"
  if cp "${src}" "${dst}" 2>/dev/null; then
    return 0
  fi
  if command -v python3 &>/dev/null; then
    python3 -c "
import os, shutil
os.makedirs(os.path.dirname('${dst}'), exist_ok=True)
shutil.copy2('${src}', '${dst}')
" 2>/dev/null
    return $?
  fi
  return 1
}

for agent; do
  for skill in "${skill_names[@]}"; do
    src="${SKILLS_DIR}/${skill}/SKILL.md"
    dest="${HOME}/.${agent}/skills/${skill}"
    dst="${dest}/SKILL.md"

    if [[ ! -f "${src}" ]]; then
      echo "  [SKIP] ${skill} — 源文件不存在"
      continue
    fi

    mkdir -p "${dest}"

    if copy_skill "${src}" "${dst}"; then
      echo "  [ OK ] ${agent} → ${dst}"
      ((ok++)) || true
    else
      echo "  [FAIL] ${agent} → ${dst}"
      ((fail++)) || true
    fi
  done
done

echo
echo "完成: ${ok} 成功, ${fail} 失败（共 ${#skill_names[@]} skill × $# agent）"
exit "${fail}"
