# Script to deploy the dist folder to GitHub Pages (gh-pages branch)

$remoteUrl = "origin"

Write-Host "1. Building the project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Aborting deployment." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "2. Preparing dist folder for deployment..." -ForegroundColor Cyan
if (Test-Path "dist\.git") {
    Remove-Item -Path "dist\.git" -Recurse -Force
}

Push-Location dist

git init
git config user.email "buiquangtrung2012@gmail.com"
git config user.name "buiquangtrung2012-ops"
git add .
git commit -m "Deploy to GitHub Pages (Plan 404)"
Write-Host "3. Pushing to gh-pages branch..." -ForegroundColor Cyan
git push --force $remoteUrl HEAD:gh-pages

Pop-Location

Write-Host "Deployment complete!" -ForegroundColor Green
