@echo off
chcp 65001 >nul
title Tour 360 - Update Tool

echo.
echo =========================================
echo   TOUR 360 - CUC THONG KE UPDATE TOOL
echo =========================================
echo.

cd /d "%~dp0"

echo Dang chay he thong cap nhat...
echo.

node custom_tools/generate_slugs.js

echo.
if %ERRORLEVEL% EQU 0 (
    echo =========================================
    echo   [THANH CONG] Cap nhat hoan tat!
    echo =========================================
) else (
    echo =========================================
    echo   [LOI] Co loi xay ra! Kiem tra node.js
    echo =========================================
)

echo.
pause
