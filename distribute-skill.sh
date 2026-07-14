#!/usr/bin/env bash
#
# distribute-skill.sh — 将 skills/ 下全部 skill 分发到各 agent 目录
#
# Usage:
#   ./distribute-skill.sh [agent-name...]
#
# 无参数时默认分发到：claude cursor deepseek kimi qwen
#
# 规则: skills/<skill-name>/ 整目录 → ~/.<agent>/skills/<skill-name>/
#       （含 SKILL.md 与 references/ 等附属文件）
#
# 示例:
#   ./distribute-skill.sh                    # 默认 agent 列表
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

# 整目录同步 skill（覆盖目标目录内容，保留其它无关文件不在此目录内）
copy_skill_dir() {
  local src_dir="$1"
  local dest_dir="$2"
  mkdir -p "${dest_dir}"
  if command -v rsync &>/dev/null; then
    rsync -a --delete "${src_dir}/" "${dest_dir}/"
    return $?
  fi
  if command -v python3 &>/dev/null; then
    python3 -c "
import os, shutil
src = '''${src_dir}'''
dst = '''${dest_dir}'''
if os.path.isdir(dst):
    shutil.rmtree(dst)
shutil.copytree(src, dst)
"
    return $?
  fi
  rm -rf "${dest_dir}"
  cp -R "${src_dir}" "${dest_dir}"
}

for agent; do
  for skill in "${skill_names[@]}"; do
    src_dir="${SKILLS_DIR}/${skill}"
    dest_dir="${HOME}/.${agent}/skills/${skill}"

    if [[ ! -f "${src_dir}/SKILL.md" ]]; then
      echo "  [SKIP] ${skill} — 源文件不存在"
      continue
    fi

    if copy_skill_dir "${src_dir}" "${dest_dir}"; then
      echo "  [ OK ] ${agent} → ${dest_dir}/"
      ((ok++)) || true
    else
      echo "  [FAIL] ${agent} → ${dest_dir}/"
      ((fail++)) || true
    fi
  done
done

echo
echo "完成: ${ok} 成功, ${fail} 失败（共 ${#skill_names[@]} skill × $# agent）"
exit "${fail}"
