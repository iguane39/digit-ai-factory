# installer.ps1 - installe la factory Digit-AI sur le projet du dossier courant, SANS QUESTION.
#
# Pourquoi ce fichier (TF-1637, 13/10/2026). Un developpeur a ecrit " Utilise
# https://github.com/iguane39/digit-ai-factory pour ce projet " sur un poste sans node. La phase 0
# commencait par `node bootstrap.mjs` : un script node ne peut pas signaler l'absence de node. La
# session a improvise une question (" node portable, winget, ou vous l'installez ? ") sur un geste
# qui n'a ni cout, ni droit administrateur, ni effet irreversible. Ce script le fait.
#
# Ce qu'il fait, dans l'ordre, chaque etape idempotente :
#   1. git present, sinon MinGit portable dans %USERPROFILE%\tools\mingit (sans droit admin) ;
#   2. node >= 18 present, sinon node LTS portable dans %USERPROFILE%\tools\node (sans droit admin) ;
#   3. uv present, sinon son installateur officiel en portee utilisateur (non bloquant) ;
#   4. le pilot localise ($FORGE_ROOT, parent du projet, c:\dev, ~\.digit-ai-forge), sinon clone
#      dans ~\.digit-ai-forge\digit-ai-factory ;
#   5. puis scripts\installer-projet.mjs : forges, skills, adoption du projet, verification, banniere.
# Les dossiers d'outils entrent au PATH UTILISATEUR (registre HKCU), jamais au PATH machine.
#
# Usage (dans le dossier du projet) :
#   powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr https://raw.githubusercontent.com/iguane39/digit-ai-factory/main/installer.ps1 -UseBasicParsing -OutFile ([IO.Path]::GetTempPath()+'digit-ai-installer.ps1'); & ([IO.Path]::GetTempPath()+'digit-ai-installer.ps1')"
# ou, pilot deja present : powershell -NoProfile -ExecutionPolicy Bypass -File <pilot>\installer.ps1
# Exit : 0 factory operationnelle - 1 installation incomplete (chaque defaut porte son remede).

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE = 'never'

$Projet = (Get-Location).Path
if ($env:FORGE_PROJET) { $Projet = $env:FORGE_PROJET }
$Outils = if ($env:FORGE_OUTILS) { $env:FORGE_OUTILS } else { Join-Path $env:USERPROFILE 'tools' }
$NeufsAuPath = @()

function Dire($statut, $msg) { Write-Host "[$statut] $msg" }

function Ajouter-PathUtilisateur($dossier) {
  if (($env:Path -split ';') -notcontains $dossier) { $env:Path = "$dossier;$env:Path" }
  if ($env:FORGE_SANS_PATH_PERSISTANT) { return }
  $actuel = [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not $actuel) { $actuel = '' }
  if (($actuel -split ';') -notcontains $dossier) {
    [Environment]::SetEnvironmentVariable('Path', ($dossier + ';' + $actuel).TrimEnd(';'), 'User')
    $script:NeufsAuPath += $dossier
  }
}

function Version-Node {
  try { $v = (& node --version) 2>$null; if ($v -match '^v(\d+)\.') { return [int]$Matches[1] } } catch {}
  return 0
}

function Telecharger($url, $dest) {
  Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing -Headers @{ 'User-Agent' = 'digit-ai-factory-installer' }
}

# 1. git ------------------------------------------------------------------------------------
$mingit = Join-Path $Outils 'mingit\cmd'
if (Test-Path (Join-Path $mingit 'git.exe')) { Ajouter-PathUtilisateur $mingit }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Dire 'pose' "git absent : MinGit portable dans $Outils\mingit (sans droit administrateur)"
  $rel = Invoke-RestMethod -Uri 'https://api.github.com/repos/git-for-windows/git/releases/latest' -Headers @{ 'User-Agent' = 'digit-ai-factory-installer' } -UseBasicParsing
  $asset = $rel.assets | Where-Object { $_.name -match '^MinGit-[\d.]+-64-bit\.zip$' } | Select-Object -First 1
  if (-not $asset) { throw "MinGit introuvable dans la derniere version de git-for-windows" }
  $zip = Join-Path $env:TEMP $asset.name
  Telecharger $asset.browser_download_url $zip
  New-Item -ItemType Directory -Force (Join-Path $Outils 'mingit') | Out-Null
  Expand-Archive -Path $zip -DestinationPath (Join-Path $Outils 'mingit') -Force
  Remove-Item $zip -Force
  Ajouter-PathUtilisateur $mingit
}
Dire 'ok' ((& git --version) -join ' ')
& git config --global core.longpaths true 2>$null

# 2. node >= 18 -----------------------------------------------------------------------------
$nodeDir = Join-Path $Outils 'node'
if ((Version-Node) -lt 18 -and (Test-Path (Join-Path $nodeDir 'node.exe'))) { Ajouter-PathUtilisateur $nodeDir }
if ((Version-Node) -lt 18) {
  $index = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json' -UseBasicParsing
  $lts = $index | Where-Object { $_.lts -and ($_.files -contains 'win-x64-zip') } | Select-Object -First 1
  $nom = "node-$($lts.version)-win-x64"
  Dire 'pose' "node >= 18 absent : node $($lts.version) LTS portable dans $nodeDir (sans droit administrateur)"
  $zip = Join-Path $env:TEMP "$nom.zip"
  Telecharger "https://nodejs.org/dist/$($lts.version)/$nom.zip" $zip
  $tmp = Join-Path $env:TEMP "digit-ai-node-$PID"
  Expand-Archive -Path $zip -DestinationPath $tmp -Force
  if (Test-Path $nodeDir) { Remove-Item $nodeDir -Recurse -Force }
  New-Item -ItemType Directory -Force $Outils | Out-Null
  Move-Item (Join-Path $tmp $nom) $nodeDir
  Remove-Item $zip, $tmp -Recurse -Force -ErrorAction SilentlyContinue
  Ajouter-PathUtilisateur $nodeDir
}
Dire 'ok' "node $((& node --version))"

# 3. uv (non bloquant : l'etape tests s'en sert, et uv sait poser python) --------------------
if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
  try {
    Dire 'pose' "uv absent : installateur officiel en portee utilisateur"
    Invoke-RestMethod -Uri 'https://astral.sh/uv/install.ps1' -UseBasicParsing | Invoke-Expression
    $uvBin = Join-Path $env:USERPROFILE '.local\bin'
    if (Test-Path (Join-Path $uvBin 'uv.exe')) { Ajouter-PathUtilisateur $uvBin }
  } catch { Dire 'avert' "uv non installe ($($_.Exception.Message)) : l'etape tests le reposera" }
}

# 4. le pilot -------------------------------------------------------------------------------
$candidats = @()
if ($env:FORGE_ROOT) { $candidats += $env:FORGE_ROOT }
$candidats += (Split-Path $Projet -Parent), 'c:\dev', (Join-Path $env:USERPROFILE '.digit-ai-forge')
$pilot = $null
foreach ($c in $candidats) {
  if (-not $c) { continue }
  $p = Join-Path $c 'digit-ai-factory'
  if ((Test-Path (Join-Path $p 'bootstrap.mjs')) -and (Test-Path (Join-Path $p 'CLAUDE.md'))) { $pilot = $p; break }
}
if (-not $pilot) {
  $racine = Join-Path $env:USERPROFILE '.digit-ai-forge'
  $pilot = Join-Path $racine 'digit-ai-factory'
  Dire 'pose' "pilot introuvable (essayes : $($candidats -join ' ; ')) : clone dans $pilot"
  New-Item -ItemType Directory -Force $racine | Out-Null
  & git clone --quiet -c core.longpaths=true https://github.com/iguane39/digit-ai-factory $pilot
  if ($LASTEXITCODE -ne 0) { Dire 'DEFAUT' "clone du pilot en echec - remede : verifier l'acces reseau a github.com, puis relancer"; exit 1 }
}
Dire 'ok' "pilot : $pilot"

# 5. forges, skills, projet, verification ---------------------------------------------------
$env:FORGE_ROOT = Split-Path $pilot -Parent
if ($NeufsAuPath.Count) { $env:FORGE_PATH_NEUF = ($NeufsAuPath -join ';') }
& node (Join-Path $pilot 'scripts\installer-projet.mjs') $Projet
exit $LASTEXITCODE
