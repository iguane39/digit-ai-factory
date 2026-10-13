#!/bin/sh
# installer.sh - installe la factory Digit-AI sur le projet du dossier courant, SANS QUESTION.
# Pendant POSIX (macOS, Linux) de installer.ps1 ; meme contrat, memes etapes (TF-1637, 13/10/2026) :
#   1. git present (sinon : defaut nomme, git s'installe par le gestionnaire du systeme) ;
#   2. node >= 18 present, sinon node LTS portable dans ~/.digit-ai-forge/tools/node (sans sudo) ;
#   3. uv present, sinon son installateur officiel en portee utilisateur (non bloquant) ;
#   4. pilot localise ($FORGE_ROOT, parent du projet, ~/.digit-ai-forge), sinon clone ;
#   5. scripts/installer-projet.mjs : forges, skills, adoption du projet, verification, banniere.
# Usage (dans le dossier du projet) :
#   curl -fsSL https://raw.githubusercontent.com/iguane39/digit-ai-factory/main/installer.sh | sh
# Exit : 0 factory operationnelle - 1 installation incomplete (chaque defaut porte son remede).
set -eu
export GIT_TERMINAL_PROMPT=0 GCM_INTERACTIVE=never
PROJET="${FORGE_PROJET:-$(pwd)}"
OUTILS="${FORGE_OUTILS:-$HOME/.digit-ai-forge/tools}"
PROFIL="$HOME/.profile"; [ -n "${ZSH_VERSION:-}" ] || [ "$(basename "${SHELL:-}")" = zsh ] && PROFIL="$HOME/.zprofile"
NEUFS=""

dire() { printf '[%s] %s\n' "$1" "$2"; }
au_path() {
  case ":$PATH:" in *":$1:"*) ;; *) PATH="$1:$PATH"; export PATH ;; esac
  [ -n "${FORGE_SANS_PATH_PERSISTANT:-}" ] && return 0
  if ! grep -qs "$1" "$PROFIL"; then
    printf '\n# digit-ai-factory (installer.sh)\nexport PATH="%s:$PATH"\n' "$1" >> "$PROFIL"
    NEUFS="$NEUFS $1"
  fi
}
version_node() { node --version 2>/dev/null | sed -n 's/^v\([0-9]*\)\..*/\1/p' || true; }

# 1. git
if ! command -v git >/dev/null 2>&1; then
  dire DEFAUT "git absent - remede : macOS 'xcode-select --install', Debian/Ubuntu 'sudo apt-get install -y git', puis relancer"
  exit 1
fi
dire ok "$(git --version)"

# 2. node >= 18
V="$(version_node)"; [ -n "$V" ] || V=0
if [ "$V" -lt 18 ] && [ -x "$OUTILS/node/bin/node" ]; then
  au_path "$OUTILS/node/bin"; V="$(version_node)"; [ -n "$V" ] || V=0
fi
if [ "$V" -lt 18 ]; then
  case "$(uname -s)" in Darwin) OS=darwin ;; Linux) OS=linux ;; *) dire DEFAUT "systeme $(uname -s) non pris en charge"; exit 1 ;; esac
  case "$(uname -m)" in x86_64|amd64) ARCH=x64 ;; arm64|aarch64) ARCH=arm64 ;; *) dire DEFAUT "architecture $(uname -m) non prise en charge"; exit 1 ;; esac
  VER="$(curl -fsSL https://nodejs.org/dist/index.json | tr '{' '\n' | grep '"lts":"' | head -1 | sed -n 's/.*"version":"\(v[0-9.]*\)".*/\1/p')"
  NOM="node-$VER-$OS-$ARCH"
  dire pose "node >= 18 absent : node $VER LTS portable dans $OUTILS/node (sans sudo)"
  mkdir -p "$OUTILS"; rm -rf "$OUTILS/node" "$OUTILS/$NOM"
  curl -fsSL "https://nodejs.org/dist/$VER/$NOM.tar.gz" | tar -xz -C "$OUTILS"
  mv "$OUTILS/$NOM" "$OUTILS/node"
  au_path "$OUTILS/node/bin"
fi
dire ok "node $(node --version)"

# 3. uv (non bloquant)
if ! command -v uv >/dev/null 2>&1; then
  dire pose "uv absent : installateur officiel en portee utilisateur"
  if curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null 2>&1; then au_path "$HOME/.local/bin"
  else dire avert "uv non installe : l'etape tests le reposera"; fi
fi

# 4. le pilot
PILOT=""
for C in "${FORGE_ROOT:-}" "$(dirname "$PROJET")" "$HOME/.digit-ai-forge"; do
  [ -n "$C" ] || continue
  if [ -f "$C/digit-ai-factory/bootstrap.mjs" ] && [ -f "$C/digit-ai-factory/CLAUDE.md" ]; then PILOT="$C/digit-ai-factory"; break; fi
done
if [ -z "$PILOT" ]; then
  PILOT="$HOME/.digit-ai-forge/digit-ai-factory"
  dire pose "pilot introuvable : clone dans $PILOT"
  mkdir -p "$HOME/.digit-ai-forge"
  git clone --quiet -c core.longpaths=true https://github.com/iguane39/digit-ai-factory "$PILOT" \
    || { dire DEFAUT "clone du pilot en echec - remede : verifier l'acces reseau a github.com, puis relancer"; exit 1; }
fi
dire ok "pilot : $PILOT"

# 5. forges, skills, projet, verification
FORGE_ROOT="$(dirname "$PILOT")"; export FORGE_ROOT
[ -n "$NEUFS" ] && FORGE_PATH_NEUF="$NEUFS" && export FORGE_PATH_NEUF
exec node "$PILOT/scripts/installer-projet.mjs" "$PROJET"
