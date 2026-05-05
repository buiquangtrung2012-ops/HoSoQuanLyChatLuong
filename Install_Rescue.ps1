# PowerShell script to register the Construction Quality Add-in (RESCUE VERSION)
# Run as Administrator

$manifestPath = "C:\CQAddin"
$shareName = "CQProAddin_New"

try {
    Write-Host "--- Construction Quality Add-in Pro (RESCUE) ---" -ForegroundColor Cyan

    # 1. Create a local share
    if (-not (Get-SmbShare -Name $shareName -ErrorAction SilentlyContinue)) {
        New-SmbShare -Name $shareName -Path $manifestPath -FullAccess Everyone
    }

    $uncPath = "\\$env:COMPUTERNAME\$shareName"
    Write-Host "New UNC Path: $uncPath" -ForegroundColor Yellow

    # 2. Update Registry
    $registryPath = "HKCU:\Software\Microsoft\Office\16.0\Registration\TrustedCatalogs\{d25087a3-5c8e-4a6c-9a4c-53538413a1e2}"
    if (-not (Test-Path $registryPath)) { New-Item -Path $registryPath -Force | Out-Null }
    
    Set-ItemProperty -Path $registryPath -Name "Url" -Value $uncPath -Force
    Set-ItemProperty -Path $registryPath -Name "Flags" -Value 1 -PropertyType DWord -Force

    Write-Host "`n[SUCCESS] Updated to simple path: $manifestPath" -ForegroundColor Green
    Write-Host "Please RESTART Word and check 'SHARED FOLDER' again."

} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Read-Host "Press Enter"
