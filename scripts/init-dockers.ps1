# ROC Docker - one script for all
# Usage: .\scripts\docker-all.ps1 [up|down|reset]
#   up    - start all containers (default)
#   down  - stop and remove containers + volumes
#   reset - down + up (rebuild)

param(
  [ValidateSet('up', 'down', 'reset')]
  [string]$Action = 'up'
)

$Root = Split-Path -Parent $PSScriptRoot
$Compose = Join-Path $Root 'docker\compose.yml'

Set-Location $Root

switch ($Action) {
  'up'   { docker compose -f $Compose up -d --build }
  'down' { docker compose -f $Compose down -v }
  'reset'{ docker compose -f $Compose down -v; docker compose -f $Compose up -d --build }
}
