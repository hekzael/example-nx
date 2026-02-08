#!/usr/bin/env bash
set -euo pipefail

if [ -f "package.json" ]; then
  if command -v npm >/dev/null 2>&1; then
    if [ -f "package-lock.json" ]; then
      npm ci
    else
      npm install
    fi

    if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.ci ? 0 : 1)"; then
      npm run -s ci
    else
      echo "No 'ci' script defined in package.json. Skipping."
    fi
  else
    echo "npm not found. Skipping."
  fi
else
  echo "No package.json found. Skipping."
fi
