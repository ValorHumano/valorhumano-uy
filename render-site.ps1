$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "Valor Humano: el sitio ya no se regenera desde una plantilla interna." -ForegroundColor Yellow
Write-Host "La version publicada se mantiene editando directamente los archivos HTML/CSS/JS de la raiz y sus carpetas." -ForegroundColor Yellow
Write-Host "Ruta de trabajo: $root" -ForegroundColor DarkGray
Write-Host ""
Write-Host "No se realizaron cambios automaticos para evitar reintroducir una version vieja del sitio." -ForegroundColor Yellow
