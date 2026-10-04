#!/usr/bin/env bash
# Install the Optimus UI Agent Skill for Claude Code, Codex, OpenCode and other agents that read SKILL.md.
#
#   curl -fsSL https://optimus.openng.org/llms/install-skill.sh | bash                  # for your user
#   curl -fsSL https://optimus.openng.org/llms/install-skill.sh | bash -s -- --project   # for the current project
#
# Installs into ~/.agents/skills (Codex, OpenCode, ...) and, when Claude Code is present, ~/.claude/skills.
# With --project the same folders are used relative to the current directory. Run it again to update.
set -euo pipefail

ZIP_URL="${OPTIMUS_SKILL_URL:-https://optimus.openng.org/llms/optimus-ui-skill.zip}"
SKILL_NAME="optimus-ui"

base="$HOME"
targets=()

while [ $# -gt 0 ]; do
    case "$1" in
        --project) base="$PWD" ;;
        --dir)
            shift
            targets+=("${1:?--dir needs a path}")
            ;;
        -h | --help)
            echo "Usage: install-skill.sh [--project] [--dir <skills-dir>]..."
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
    shift
done

if [ ${#targets[@]} -eq 0 ]; then
    targets+=("$base/.agents/skills")
    if [ -d "$base/.claude" ] || command -v claude >/dev/null 2>&1; then
        targets+=("$base/.claude/skills")
    fi
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading $ZIP_URL"
curl -fsSL "$ZIP_URL" -o "$tmp/skill.zip"

if command -v unzip >/dev/null 2>&1; then
    unzip -q "$tmp/skill.zip" -d "$tmp/out"
elif command -v python3 >/dev/null 2>&1; then
    python3 -m zipfile -e "$tmp/skill.zip" "$tmp/out"
elif command -v bsdtar >/dev/null 2>&1; then
    mkdir -p "$tmp/out" && bsdtar -xf "$tmp/skill.zip" -C "$tmp/out"
else
    echo "Need unzip, python3 or bsdtar to extract the skill." >&2
    exit 1
fi

[ -f "$tmp/out/$SKILL_NAME/SKILL.md" ] || {
    echo "Downloaded archive does not contain $SKILL_NAME/SKILL.md" >&2
    exit 1
}

for dir in "${targets[@]}"; do
    mkdir -p "$dir"
    rm -rf "${dir:?}/$SKILL_NAME"
    cp -R "$tmp/out/$SKILL_NAME" "$dir/$SKILL_NAME"
    echo "Installed $SKILL_NAME skill into $dir/$SKILL_NAME"
done
