#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd "$SCRIPT_DIR/.." && pwd)
REPO_ROOT=$(git -C "$PROJECT_ROOT" rev-parse --show-toplevel 2>/dev/null || true)

if [ -z "$REPO_ROOT" ]; then
	exit 0
fi

HOOKS_PATH="$PROJECT_ROOT/config/githooks"

git -C "$PROJECT_ROOT" config --local core.hooksPath "$HOOKS_PATH"
chmod +x "$HOOKS_PATH/pre-commit"

printf '%s\n' "Git hooks path set to $HOOKS_PATH"
