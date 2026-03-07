# Stop, remove, and restart all Docker containers
$Root = Split-Path -Parent $PSScriptRoot
$Compose = Join-Path $Root 'docker\compose.yml'
Set-Location $Root
docker compose -f $Compose down -v
docker compose -f $Compose up -d --build
