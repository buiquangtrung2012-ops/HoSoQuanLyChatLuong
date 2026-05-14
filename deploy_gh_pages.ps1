# Script to deploy the dist folder to GitHub Pages (gh-pages branch)
# Includes: version archiving into /versions/vXXX/ and auto-updating changelog.json
# Parses README.md to extract real changelog entries per version
# Max old versions kept: 5

$remoteUrl = "https://github.com/buiquangtrung2012-ops/HoSoQuanLyChatLuong.git"
$MAX_OLD_VERSIONS = 5

# ─────────────────────────────────────────────
# HELPER: Parse README.md to extract changelog per version
# Returns hashtable: version -> @(change lines)
# ─────────────────────────────────────────────
function Parse-ReadmeChangelog {
    param([string]$ReadmePath)

    $result = @{}
    $lines = [System.IO.File]::ReadAllLines($ReadmePath, [System.Text.Encoding]::UTF8)

    $currentVersion = $null
    $currentChanges = [System.Collections.Generic.List[string]]::new()
    $inHistory = $false

    foreach ($line in $lines) {
        # Detect start of history section
        if ($line -match '^##\s+L.+c.*s.*c.*p.*nh') {
            $inHistory = $true
            continue
        }
        if (-not $inHistory) { continue }

        # Detect version header like: ### vDDMMYYYY.HHMM (DD/MM/YYYY)
        if ($line -match '^###\s+(v\d{8}\.\d{4})') {
            # Save previous version
            if ($currentVersion -ne $null -and $currentChanges.Count -gt 0) {
                $result[$currentVersion] = $currentChanges.ToArray()
            }
            $currentVersion = $Matches[1]
            $currentChanges = [System.Collections.Generic.List[string]]::new()
            continue
        }

        # Stop if we hit a new H2 section (##) that is not the history section
        if ($line -match '^##\s+' -and $line -notmatch '^###') {
            if ($currentVersion -ne $null -and $currentChanges.Count -gt 0) {
                $result[$currentVersion] = $currentChanges.ToArray()
            }
            break
        }

        if ($currentVersion -ne $null) {
            # Collect bullet lines (- ...) and sub-bullets (indented -)
            $trimmed = $line.TrimStart()
            if ($trimmed.StartsWith('- ') -or $trimmed.StartsWith('* ')) {
                # Strip markdown bold (**text**) for plain text display
                $clean = $trimmed.Substring(2).Trim()
                # Remove markdown bold markers but keep text
                $clean = [regex]::Replace($clean, '\*\*([^*]+)\*\*', '$1')
                # Remove inline code backticks
                $clean = [regex]::Replace($clean, '`([^`]+)`', '$1')
                $currentChanges.Add($clean) | Out-Null
            }
        }
    }

    # Save last version
    if ($currentVersion -ne $null -and $currentChanges.Count -gt 0) {
        $result[$currentVersion] = $currentChanges.ToArray()
    }

    return $result
}

# ─────────────────────────────────────────────
# Step 1: Read current version from VersionManager.tsx
# ─────────────────────────────────────────────
Write-Host "1. Detecting current version..." -ForegroundColor Cyan
$versionFile = "src\components\VersionManager.tsx"
$versionLine = Select-String -Path $versionFile -Pattern "CURRENT_VERSION\s*=\s*'(v[^']+)'" | Select-Object -First 1
if ($versionLine.Line -match "'(v[^']+)'") {
    $CURRENT_VERSION = $Matches[1]
} else {
    Write-Host "ERROR: Could not detect version from $versionFile" -ForegroundColor Red
    exit 1
}
Write-Host "   Detected version: $CURRENT_VERSION" -ForegroundColor Green

# ─────────────────────────────────────────────
# Step 2: Parse README.md for changelog entries
# ─────────────────────────────────────────────
Write-Host "2. Parsing README.md for changelog entries..." -ForegroundColor Cyan
$readmeChangelog = Parse-ReadmeChangelog -ReadmePath "README.md"
Write-Host "   Found $($readmeChangelog.Count) version(s) in README.md" -ForegroundColor Green
foreach ($v in $readmeChangelog.Keys) {
    Write-Host "      $v : $($readmeChangelog[$v].Count) change(s)" -ForegroundColor Gray
}

# ─────────────────────────────────────────────
# Step 3: Build the project
# ─────────────────────────────────────────────
Write-Host "3. Building the project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Aborting deployment." -ForegroundColor Red
    exit $LASTEXITCODE
}

# ─────────────────────────────────────────────
# Step 4: Fetch existing versions and changelog from gh-pages
# ─────────────────────────────────────────────
Write-Host "4. Fetching existing versions from gh-pages..." -ForegroundColor Cyan
$tempGhPages = "temp_gh_pages"
if (Test-Path $tempGhPages) { Remove-Item -Path $tempGhPages -Recurse -Force }

try {
    git clone --branch gh-pages --depth 1 $remoteUrl $tempGhPages
    if (Test-Path "$tempGhPages\versions") {
        if (-not (Test-Path "dist\versions")) { New-Item -ItemType Directory -Path "dist\versions" -Force | Out-Null }
        Copy-Item -Path "$tempGhPages\versions\*" -Destination "dist\versions" -Recurse -Force
        Write-Host "   Previous versions restored from gh-pages." -ForegroundColor Green
    }
    if (Test-Path "$tempGhPages\changelog.json") {
        $existingChangelog = Get-Content "$tempGhPages\changelog.json" | ConvertFrom-Json
        Write-Host "   Existing changelog found." -ForegroundColor Gray
    }
    Remove-Item -Path $tempGhPages -Recurse -Force
} catch {
    Write-Host "   Could not fetch existing versions (first deploy or branch missing)." -ForegroundColor Yellow
}

# ─────────────────────────────────────────────
# Step 5: Copy current build to dist/versions/CURRENT_VERSION/
# ─────────────────────────────────────────────
Write-Host "5. Archiving current build to dist\versions\$CURRENT_VERSION ..." -ForegroundColor Cyan
$versionDir = "dist\versions\$CURRENT_VERSION"
if (-not (Test-Path $versionDir)) {
    New-Item -ItemType Directory -Path $versionDir -Force | Out-Null
}
Get-ChildItem -Path "dist" -Exclude "versions" | Copy-Item -Destination $versionDir -Recurse -Force

# ─────────────────────────────────────────────
# Step 6: Build updated changelog.json from README data
# ─────────────────────────────────────────────
Write-Host "6. Building changelog.json from README.md data..." -ForegroundColor Cyan

# Get all versions from README in order (newest first)
# Sort by version string descending (vDDMMYYYY.HHMM -> YYYYMMDD.HHMM for sort)
function Get-SortKey {
    param([string]$ver)
    # ver = "vDDMMYYYY.HHMM"
    if ($ver -match '^v(\d{2})(\d{2})(\d{4})\.(\d{4})$') {
        return "$($Matches[3])$($Matches[2])$($Matches[1]).$($Matches[4])"
    }
    return $ver
}

$sortedVersions = $readmeChangelog.Keys | Sort-Object { Get-SortKey $_ } -Descending

# Build version entries array
$allVersions = @()

foreach ($ver in $sortedVersions) {
    $changes = $readmeChangelog[$ver]
    if ($ver -eq $CURRENT_VERSION) {
        $path = "/HoSoQuanLyChatLuong/"
    } else {
        $path = "/HoSoQuanLyChatLuong/versions/$ver/"
    }

    # Extract date from version string vDDMMYYYY.HHMM
    $date = ""
    if ($ver -match '^v(\d{2})(\d{2})(\d{4})\.\d{4}$') {
        $date = "$($Matches[1])/$($Matches[2])/$($Matches[3])"
    }

    $entry = [ordered]@{
        version = $ver
        date    = $date
        changes = $changes
        path    = $path
    }
    $allVersions += $entry
}

# Limit to current + MAX_OLD_VERSIONS older entries
if ($allVersions.Count -gt ($MAX_OLD_VERSIONS + 1)) {
    $allVersions = $allVersions | Select-Object -First ($MAX_OLD_VERSIONS + 1)
}

$changelogObj = [ordered]@{
    latest   = $CURRENT_VERSION
    versions = $allVersions
}

$changelogJson = $changelogObj | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText("$PWD\dist\changelog.json", $changelogJson, [System.Text.Encoding]::UTF8)
Write-Host "   changelog.json written with $($allVersions.Count) version(s)." -ForegroundColor Green

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

Write-Host "Deployment of $CURRENT_VERSION complete!" -ForegroundColor Green
Write-Host "GitHub Pages will update in ~30 seconds." -ForegroundColor Gray
Write-Host "changelog.json has $($allVersions.Count) version(s) with full details from README.md" -ForegroundColor Gray
