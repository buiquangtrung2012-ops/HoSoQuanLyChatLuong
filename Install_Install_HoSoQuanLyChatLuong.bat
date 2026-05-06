@echo off
title Ho So Quan Ly Chat Luong Installer
color 0A

:: ==============================
:: CONFIG
:: ==============================
set "INSTALL_DIR=%APPDATA%\HoSoQuanLyChatLuong"
set "MANIFEST_PATH=%INSTALL_DIR%\manifest_github.xml"
set "GITHUB_RAW_URL=https://raw.githubusercontent.com/buiquangtrung2012-ops/HoSoQuanLyChatLuong/main/manifest_github.xml"

echo ========================================
echo   INSTALL HO SO QUAN LY CHAT LUONG
echo ========================================
echo.

:: Create folder
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Download manifest
echo Downloading manifest_github.xml from GitHub...
powershell -Command "Invoke-WebRequest -Uri '%GITHUB_RAW_URL%' -OutFile '%MANIFEST_PATH%'"

if not exist "%MANIFEST_PATH%" (
    echo ERROR: Download manifest failed
    pause
    exit /b
)

echo Manifest downloaded successfully.
echo.

:: Close Word
echo Closing Microsoft Word...
taskkill /f /im WINWORD.EXE >nul 2>&1

:: Clear Office cache
echo Clearing Office cache...
rmdir /s /q "%LOCALAPPDATA%\Microsoft\Office\16.0\Wef" >nul 2>&1
rmdir /s /q "%LOCALAPPDATA%\Microsoft\Office\16.0\WebServiceCache" >nul 2>&1

:: Register Add-in
echo Registering Developer Add-in...
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\Developer" ^
 /v "HoSoQuanLyChatLuong" ^
 /t REG_SZ ^
 /d "%MANIFEST_PATH%" ^
 /f

:: Launch Word
echo Opening Microsoft Word...
start winword

echo.
echo ========================================
echo INSTALL COMPLETED SUCCESSFULLY
echo ========================================
echo.
pause