#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

INSTALL_DEPS=true
START_DB=true

for arg in "$@"; do
  case "$arg" in
    --skip-install)
      INSTALL_DEPS=false
      ;;
    --skip-db)
      START_DB=false
      ;;
    -h|--help)
      cat <<'EOF'
Usage: ./start-dev.sh [options]

Options:
  --skip-install   Skip npm dependency installation
  --skip-db        Skip starting postgres container
  -h, --help       Show this help message
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Run ./start-dev.sh --help for supported options."
      exit 1
      ;;
  esac
done

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but was not found in PATH."
  exit 1
fi

start_postgres() {
  if command -v docker >/dev/null 2>&1; then
    if docker compose version >/dev/null 2>&1; then
      (cd "$ROOT_DIR" && docker compose up -d postgres)
      return
    fi
    if command -v docker-compose >/dev/null 2>&1; then
      (cd "$ROOT_DIR" && docker-compose up -d postgres)
      return
    fi
  fi

  echo "Docker Compose not available; skipping postgres startup."
  echo "The backend can still run with SQL.js unless DATABASE_TYPE=postgres is set."
}

install_dir_deps() {
  local dir="$1"
  if [[ -f "$dir/package-lock.json" ]]; then
    (cd "$dir" && npm ci)
  else
    (cd "$dir" && npm install)
  fi
}

if [[ "$START_DB" == true ]]; then
  echo "Starting postgres dependency..."
  start_postgres
fi

if [[ "$INSTALL_DEPS" == true ]]; then
  echo "Installing backend dependencies..."
  install_dir_deps "$BACKEND_DIR"

  echo "Installing frontend dependencies..."
  install_dir_deps "$FRONTEND_DIR"
fi

echo "Starting backend and frontend dev servers..."
(cd "$BACKEND_DIR" && npm run dev) &
BACKEND_PID=$!

(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

cleanup() {
  echo
  echo "Stopping dev servers..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo "Press Ctrl+C to stop."

wait "$BACKEND_PID" "$FRONTEND_PID"