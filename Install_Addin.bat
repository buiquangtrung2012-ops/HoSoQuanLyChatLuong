@echo off
title Construction Quality Pro Installer
color 0B

set "INSTALL_DIR=%APPDATA%\CQProAddin"
set "MANIFEST_PATH=%INSTALL_DIR%\manifest.xml"
set "GITHUB_RAW_URL=https://raw.githubusercontent.com/buiquangtrung2012-ops/HoSoQuanLyChatLuong/main/manifest_github.xml"

echo ===================================================
echo   Cai dat Construction Quality Add-in Pro (GitHub)
echo ===================================================
echo.

if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [1/4] Dang tai file manifest tu GitHub...
powershell -Command "Invoke-WebRequest -Uri '%GITHUB_RAW_URL%' -OutFile '%MANIFEST_PATH%'"

if not exist "%MANIFEST_PATH%" (
    echo [LOI] Khong the tai file manifest. Vui long kiem tra ket noi mang.
    pause
    exit /b
)

echo [2/4] Dang dong Microsoft Word...
taskkill /f /im WINWORD.EXE >nul 2>&1

echo [3/4] Dang xoa bo nho dem Office (Cache)...
rmdir /s /q "%LOCALAPPDATA%\Microsoft\Office\16.0\Wef" >nul 2>&1
rmdir /s /q "%LOCALAPPDATA%\Microsoft\Office\16.0\WebServiceCache" >nul 2>&1

echo [4/4] Dang dang ky Add-in vao Registry...
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\Developer" ^
 /v "CQProAddin" ^
 /t REG_SZ ^
 /d "%MANIFEST_PATH%" ^
 /f

echo.
echo ===================================================
echo   CHUC MUNG! Cai dat hoan tat.
echo   Word se tu dong mo len ngay bay gio.
echo ===================================================
echo.

start winword
pause
