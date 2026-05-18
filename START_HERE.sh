#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_ENV_FILE="$BACKEND_DIR/.env"
FRONTEND_ENV_FILE="$FRONTEND_DIR/.env"

INSTALL_DEPS=true
START_DB=true
FORCE_INSTALL=false
USE_POSTGRES=false
KILL_PORTS=false

print_help() {
  cat <<'EOF'
Usage: ./START_HERE.sh [options]

Options:
  --skip-install   Skip npm dependency installation
  --force-install  Always run dependency installation even if node_modules exist
  --skip-db        Skip starting Postgres container
  --use-postgres   Start backend with DATABASE_TYPE=postgres
  --kill-ports     Kill existing processes on ports 3000 and 3001 before start
  -h, --help       Show this help message

Examples:
  ./START_HERE.sh
  ./START_HERE.sh --use-postgres
  ./START_HERE.sh --skip-install --skip-db
EOF
}

require_command() {
  local command_name="$1"
  local message="$2"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "$message"
    exit 1
  fi
}

ensure_path_exists() {
  local path="$1"
  local label="$2"

  if [[ ! -e "$path" ]]; then
    echo "Missing required $label at: $path"
    exit 1
  fi
}

ensure_env_file() {
  local env_file="$1"
  local env_example_file="$2"

  if [[ -f "$env_file" ]]; then
    return
  fi

  if [[ -f "$env_example_file" ]]; then
    cp "$env_example_file" "$env_file"
    echo "Created $env_file from $(basename "$env_example_file")"
  else
    : > "$env_file"
    echo "Created empty $env_file"
  fi
}

get_compose_command() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return
  fi

  echo ""
}

is_port_in_use() {
  local port="$1"
  lsof -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1
}

kill_port_processes() {
  local port="$1"
  local pids

  pids="$(lsof -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | tr '\n' ' ')"
  if [[ -z "$pids" ]]; then
    return
  fi

  echo "Killing process(es) on port $port: $pids"
  kill $pids 2>/dev/null || true
}

ensure_ports_available() {
  local conflict_found=false

  for port in 3000 3001; do
    if is_port_in_use "$port"; then
      if [[ "$KILL_PORTS" == true ]]; then
        kill_port_processes "$port"
      else
        local pids
        pids="$(lsof -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | tr '\n' ' ')"
        echo "Port $port is already in use by process(es): $pids"
        conflict_found=true
      fi
    fi
  done

  if [[ "$conflict_found" == true ]]; then
    echo "Free ports 3000 and 3001, or rerun with --kill-ports."
    exit 1
  fi
}

for arg in "$@"; do
  case "$arg" in
    --skip-install)
      INSTALL_DEPS=false
      ;;
    --force-install)
      FORCE_INSTALL=true
      ;;
    --skip-db)
      START_DB=false
      ;;
    --use-postgres)
      USE_POSTGRES=true
      ;;
    --kill-ports)
      KILL_PORTS=true
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Run ./START_HERE.sh --help for supported options."
      exit 1
      ;;
  esac
done

ensure_path_exists "$BACKEND_DIR" "backend directory"
ensure_path_exists "$FRONTEND_DIR" "frontend directory"
ensure_path_exists "$BACKEND_DIR/package.json" "backend package.json"
ensure_path_exists "$FRONTEND_DIR/package.json" "frontend package.json"

require_command "node" "Node.js is required but was not found in PATH."
require_command "npm" "npm is required but was not found in PATH."

NODE_MAJOR_VERSION="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR_VERSION" -lt 18 ]]; then
  echo "Node.js 18+ is required. Current version: $(node -v)"
  exit 1
fi

ensure_env_file "$BACKEND_ENV_FILE" "$BACKEND_DIR/.env.example"
ensure_env_file "$FRONTEND_ENV_FILE" "$FRONTEND_DIR/.env.example"
ensure_ports_available

start_postgres() {
  local compose_cmd
  compose_cmd="$(get_compose_command)"

  if [[ -n "$compose_cmd" ]]; then
    (cd "$ROOT_DIR" && $compose_cmd up -d postgres)
    return
  fi

  echo "Docker Compose not available; skipping postgres startup."
  echo "The backend can still run with SQL.js unless DATABASE_TYPE=postgres is set."
}

install_dir_deps() {
  local dir="$1"

  if [[ "$FORCE_INSTALL" == false && -d "$dir/node_modules" ]]; then
    echo "Dependencies already present in $dir (use --force-install to reinstall)."
    return
  fi

  if [[ -f "$dir/package-lock.json" ]]; then
    if ! (cd "$dir" && npm ci); then
      echo "npm ci failed in $dir; falling back to npm install..."
      (cd "$dir" && npm install)
    fi
  else
    (cd "$dir" && npm install)
  fi
}

if [[ "$START_DB" == true ]]; then
  echo "Starting postgres dependency..."
  start_postgres
fi

if [[ "$USE_POSTGRES" == true && "$START_DB" == false ]]; then
  echo "Postgres mode requested but DB startup is skipped."
  echo "Ensure your Postgres server is already running and backend/.env is configured."
fi

if [[ "$INSTALL_DEPS" == true ]]; then
  echo "Installing backend dependencies..."
  install_dir_deps "$BACKEND_DIR"

  echo "Installing frontend dependencies..."
  install_dir_deps "$FRONTEND_DIR"
fi

echo "Starting backend and frontend dev servers..."
if [[ "$USE_POSTGRES" == true ]]; then
  (cd "$BACKEND_DIR" && DATABASE_TYPE=postgres npm run dev) &
else
  (cd "$BACKEND_DIR" && npm run dev) &
fi
BACKEND_PID=$!

(cd "$FRONTEND_DIR" && npm run dev -- --port 3000 --strictPort) &
FRONTEND_PID=$!

cleanup() {
  echo
  echo "Stopping dev servers..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
if [[ "$USE_POSTGRES" == true ]]; then
  echo "Database: Postgres mode enabled (DATABASE_TYPE=postgres)."
else
  echo "Database: SQL.js mode (default)."
fi
echo "Press Ctrl+C to stop."

wait "$BACKEND_PID" "$FRONTEND_PID"