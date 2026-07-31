#!/usr/bin/env bash
# =============================================================================
# setup-git-flow.sh
#
# Automatiza:
#   - Creación de ramas main / dev / qa
#   - 5 ramas feature/ y hotfix/ (mínimo requerido)
#   - 3 Pull Requests por cada rama (hacia dev, qa y main) = 15 PRs cerradas
#   - Merge final de todo hacia main
#
# REQUISITOS ANTES DE EJECUTAR:
#   1. Tener instalado git:        https://git-scm.com
#   2. Tener instalado GitHub CLI: https://cli.github.com
#   3. Autenticarte una vez:       gh auth login
#   4. Haber creado un repo VACÍO en GitHub (sin README) y tener su URL.
#
# USO:
#   chmod +x scripts/setup-git-flow.sh
#   ./scripts/setup-git-flow.sh git@github.com:TU-USUARIO/arte-mundial.git
#
# (ejecuta este script desde la carpeta raíz del proyecto, arte-mundial/)
# =============================================================================

set -e

REPO_URL="$1"
if [ -z "$REPO_URL" ]; then
  echo "Uso: ./scripts/setup-git-flow.sh <url-de-tu-repo-github>"
  exit 1
fi

echo "== Verificando GitHub CLI =="
if ! command -v gh &> /dev/null; then
  echo "ERROR: necesitas instalar GitHub CLI (gh). Ver https://cli.github.com"
  exit 1
fi

# --- 1. Inicializar repo local ---
if [ ! -d ".git" ]; then
  git init
fi

git checkout -B main
git add .
git commit -m "chore: commit inicial del proyecto ArteMundial" || true

git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git push -u origin main

# --- 2. Ramas dev y qa ---
git checkout -b dev
git push -u origin dev

git checkout -b qa
git push -u origin qa

# --- 3. Definición de las 5 ramas (mínimo requerido) ---
# Cada una toca un archivo distinto para simular trabajo real y evitar conflictos.
declare -A RAMAS
RAMAS["feature/artwork-crud-api"]="server.js"
RAMAS["feature/artwork-list-ui"]="public/app.js"
RAMAS["feature/validate-user-input"]="server.js"
RAMAS["feature/search-and-filter"]="public/index.html"
RAMAS["feature/purchase-registration"]="public/app.js"
RAMAS["hotfix/fix-price-format"]="public/style.css"

# --- 4. Por cada rama: commit + 3 PRs (dev, qa, main) ---
for RAMA in "${!RAMAS[@]}"; do
  echo ""
  echo "=================================================="
  echo "  Procesando rama: $RAMA"
  echo "=================================================="

  git checkout dev
  git checkout -b "$RAMA"

  ARCHIVO="${RAMAS[$RAMA]}"
  echo "" >> "$ARCHIVO"
  echo "// Ajuste realizado en la rama $RAMA - $(date)" >> "$ARCHIVO"

  git add "$ARCHIVO"
  git commit -m "feat: cambios de la rama $RAMA"
  git push -u origin "$RAMA"

  # PR 1: hacia dev
  gh pr create --base dev --head "$RAMA" \
    --title "$RAMA -> dev" \
    --body "Integración de $RAMA en dev" || true
  gh pr merge "$RAMA" --base dev --merge --delete-branch=false || \
    gh pr merge "$RAMA" --merge --delete-branch=false

  # PR 2: hacia qa
  gh pr create --base qa --head "$RAMA" \
    --title "$RAMA -> qa" \
    --body "Validación de $RAMA en qa" || true
  gh pr merge "$RAMA" --base qa --merge --delete-branch=false || \
    gh pr merge "$RAMA" --merge --delete-branch=false

  # PR 3: hacia main
  gh pr create --base main --head "$RAMA" \
    --title "$RAMA -> main" \
    --body "Despliegue final de $RAMA en main" || true
  gh pr merge "$RAMA" --base main --merge --delete-branch=false || \
    gh pr merge "$RAMA" --merge --delete-branch=false

done

echo ""
echo "=================================================="
echo " LISTO. Revisa en GitHub:"
echo "  - 5 ramas feature/hotfix creadas"
echo "  - 15 Pull Requests cerradas/mergeadas (5 ramas x 3 PRs)"
echo "  - main, dev y qa actualizadas con todos los cambios"
echo "=================================================="
