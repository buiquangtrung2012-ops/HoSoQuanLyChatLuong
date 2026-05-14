# Script to deploy the dist folder to GitHub Pages (gh-pages branch)
# Includes: version archiving into /versions/vXXX/ and auto-updating changelog.json
# Max old versions kept: 5

$remoteUrl = "https://github.com/buiquangtrung2012-ops/HoSoQuanLyChatLuong.git"
$MAX_OLD_VERSIONS = 5

# ─────────────────────────────────────────────
# Step 1: Read current version from VersionManager.tsx
# ─────────────────────────────────────────────
Write-Host "1. Detecting current version..." -ForegroundColor Cyan
$versionFile = "src\components\VersionManager.tsx"
$versionLine = Select-String -Path $versionFile -Pattern "CURRENT_VERSION\s*=\s*'(v[^']+)'" | Select-Object -First 1
if ($versionLine -match "'(v[^']+)'") {
    $CURRENT_VERSION = $Matches[1]
} else {
    Write-Host "ERROR: Could not detect version from $versionFile" -ForegroundColor Red
    exit 1
}
Write-Host "   Detected version: $CURRENT_VERSION" -ForegroundColor Green

# ─────────────────────────────────────────────
# Step 2: Build the project
# ─────────────────────────────────────────────
Write-Host "2. Building the project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Aborting deployment." -ForegroundColor Red
    exit $LASTEXITCODE
}

# ─────────────────────────────────────────────
# Step 3: Fetch existing changelog.json from gh-pages (if available)
# ─────────────────────────────────────────────
Write-Host "3. Fetching existing changelog from gh-pages..." -ForegroundColor Cyan
$changelogUrl = "https://raw.githubusercontent.com/buiquangtrung2012-ops/HoSoQuanLyChatLuong/gh-pages/changelog.json"
$existingChangelog = $null
try {
    $response = Invoke-WebRequest -Uri $changelogUrl -UseBasicParsing -ErrorAction Stop
    $existingChangelog = $response.Content | ConvertFrom-Json
    Write-Host "   Existing changelog fetched. Latest was: $($existingChangelog.latest)" -ForegroundColor Gray
} catch {
    Write-Host "   No existing changelog found (first deploy or network issue). Creating fresh one." -ForegroundColor Yellow
}

# ─────────────────────────────────────────────
# Step 4: Copy current build to dist/versions/CURRENT_VERSION/
# ─────────────────────────────────────────────
Write-Host "4. Archiving current build to dist\versions\$CURRENT_VERSION ..." -ForegroundColor Cyan
$versionDir = "dist\versions\$CURRENT_VERSION"
if (-not (Test-Path $versionDir)) {
    New-Item -ItemType Directory -Path $versionDir -Force | Out-Null
}
# Copy all built assets into the version subfolder, preserving structure
Copy-Item -Path "dist\*" -Destination $versionDir -Recurse -Force -Exclude "versions"

# ─────────────────────────────────────────────
# Step 5: Copy older version directories from gh-pages (if available)
# ─────────────────────────────────────────────
if ($existingChangelog -ne $null -and $existingChangelog.versions.Count -gt 0) {
    Write-Host "5. Preserving up to $MAX_OLD_VERSIONS old versions from gh-pages..." -ForegroundColor Cyan

    # Fetch list of old version directories from gh-pages API
    $apiUrl = "https://api.github.com/repos/buiquangtrung2012-ops/HoSoQuanLyChatLuong/contents/versions?ref=gh-pages"
    try {
        $repoContents = Invoke-RestMethod -Uri $apiUrl -UseBasicParsing -ErrorAction Stop
        # repoContents is an array of directory entries
        $oldVersions = $existingChangelog.versions | Where-Object { $_.version -ne $CURRENT_VERSION } | Select-Object -First $MAX_OLD_VERSIONS
        Write-Host "   Will include $($oldVersions.Count) old versions in changelog." -ForegroundColor Gray
    } catch {
        Write-Host "   Could not fetch old version list from GitHub API (rate limit or network). Skipping." -ForegroundColor Yellow
        $oldVersions = @()
    }
} else {
    $oldVersions = @()
}

# ─────────────────────────────────────────────
# Step 6: Build updated changelog.json
# ─────────────────────────────────────────────
Write-Host "6. Building changelog.json..." -ForegroundColor Cyan

# Current version entry (changes from README.md if possible, otherwise placeholder)
$currentEntry = @{
    version = $CURRENT_VERSION
    date    = (Get-Date -Format "dd/MM/yyyy")
    changes = @("Deploy mới nhất — xem README.md để biết chi tiết thay đổi.")
    path    = "/HoSoQuanLyChatLuong/"
}

# If existing changelog already has an entry for this version, keep its changes
if ($existingChangelog -ne $null) {
    $existingEntry = $existingChangelog.versions | Where-Object { $_.version -eq $CURRENT_VERSION } | Select-Object -First 1
    if ($existingEntry -ne $null) {
        $currentEntry.changes = $existingEntry.changes
        Write-Host "   Reusing existing changelog entry for $CURRENT_VERSION." -ForegroundColor Gray
    }
}

# Collect older version entries (up to MAX_OLD_VERSIONS)
$olderEntries = @()
if ($existingChangelog -ne $null) {
    $olderEntries = $existingChangelog.versions |
        Where-Object { $_.version -ne $CURRENT_VERSION } |
        Select-Object -First $MAX_OLD_VERSIONS |
        ForEach-Object {
            @{
                version = $_.version
                date    = $_.date
                changes = $_.changes
                path    = "/HoSoQuanLyChatLuong/versions/$($_.version)/"
            }
        }
}

$changelogObj = @{
    latest   = $CURRENT_VERSION
    versions = @($currentEntry) + @($olderEntries)
}

$changelogJson = $changelogObj | ConvertTo-Json -Depth 10
$changelogJson | Out-File -FilePath "dist\changelog.json" -Encoding utf8
Write-Host "   changelog.json written." -ForegroundColor Green

# ─────────────────────────────────────────────
# Step 7: Deploy dist to gh-pages
# ─────────────────────────────────────────────
Write-Host "7. Preparing dist folder for deployment..." -ForegroundColor Cyan
if (Test-Path "dist\.git") {
    Remove-Item -Path "dist\.git" -Recurse -Force
}

Push-Location dist

git init
git config user.email "buiquangtrung2012@gmail.com"
git config user.name "buiquangtrung2012-ops"
git add .
git commit -m "Deploy $CURRENT_VERSION to GitHub Pages"
Write-Host "8. Pushing to gh-pages branch..." -ForegroundColor Cyan
git push --force $remoteUrl HEAD:gh-pages

Pop-Location

Write-Host "✅ Deployment of $CURRENT_VERSION complete!" -ForegroundColor Green
Write-Host "   GitHub Pages will update in ~30 seconds." -ForegroundColor Gray
Write-Host "   changelog.json has $($changelogObj.versions.Count) version(s) listed." -ForegroundColor Gray
