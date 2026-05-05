# PowerShell script to register the Construction Quality Add-in as a Trusted Add-in
# This script must be run as Administrator

function Check-Admin {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Check-Admin)) {
    Write-Host "ERROR: Please run this script as ADMINISTRATOR!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script."
    Read-Host "Press Enter to exit"
    exit
}

$manifestPath = "C:\Users\buiqu\.gemini\antigravity\scratch\HoSoQuanLyChatLuong"
$shareName = "CQProAddin"

try {
    Write-Host "--- Construction Quality Add-in Pro Installer ---" -ForegroundColor Cyan

    # 1. Create a local share for the manifest folder
    Write-Host "Checking network share..."
    $existingShare = Get-SmbShare -Name $shareName -ErrorAction SilentlyContinue
    if (-not $existingShare) {
        Write-Host "Creating network share '$shareName' at $manifestPath..." -ForegroundColor Gray
        New-SmbShare -Name $shareName -Path $manifestPath -FullAccess Everyone -ErrorAction Stop
    } else {
        Write-Host "Share '$shareName' already exists pointing to $($existingShare.Path)." -ForegroundColor Gray
    }

    $uncPath = "\\$env:COMPUTERNAME\$shareName"
    Write-Host "UNC Path for Office: $uncPath" -ForegroundColor Yellow

    # 2. Add to Word/Excel Trusted Catalogs via Registry
    Write-Host "Updating Windows Registry..."
    $registryPath = "HKCU:\Software\Microsoft\Office\16.0\Registration\TrustedCatalogs"
    
    if (-not (Test-Path $registryPath)) {
        New-Item -Path $registryPath -Force | Out-Null
    }

    # Use a fixed GUID for this specific add-in
    $guid = "{d25087a3-5c8e-4a6c-9a4c-53538413a1e2}"
    $catalogPath = "Registry::HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Registration\TrustedCatalogs\$guid"

    if (-not (Test-Path $catalogPath)) {
        New-Item -Path $catalogPath -Force | Out-Null
    }

    # Use New-ItemProperty with -Force to handle both create and update correctly across PS versions
    New-ItemProperty -Path $catalogPath -Name "Id" -Value $guid -PropertyType String -Force | Out-Null
    New-ItemProperty -Path $catalogPath -Name "Url" -Value $uncPath -PropertyType String -Force | Out-Null
    New-ItemProperty -Path $catalogPath -Name "Flags" -Value 1 -PropertyType DWord -Force | Out-Null

    Write-Host "`n[SUCCESS] Add-in catalog registered successfully!" -ForegroundColor Green
    Write-Host "---------------------------------------------------"
    Write-Host "1. Restart Word or Excel."
    Write-Host "2. Go to: Insert -> My Add-ins."
    Write-Host "3. Look for the 'SHARED FOLDER' (THƯ MỤC CHIA SẺ) tab."
    Write-Host "4. Select 'Construction Quality Pro' and click 'Add'."
    Write-Host "---------------------------------------------------"

} catch {
    Write-Host "`n[ERROR] An error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
}

Read-Host "`nPress Enter to close this window"
