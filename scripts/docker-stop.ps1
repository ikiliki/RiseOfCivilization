# Stop and remove all Docker containers + volumes
$Root = Split-Path -Parent $PSScriptRoot
$Compose = Join-Path $Root 'docker\compose.yml'
Set-Location $Root
docker compose -f $Compose down -v
