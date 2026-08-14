@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo  E-V-E LMS Platform - Auto Git Sync ^& Commit Tool
echo ========================================================
echo.

:: 1. Lấy tên branch hiện tại
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
echo [*] Nhanh hien tai: %CURRENT_BRANCH%

:: 2. Nhận commit message từ tham số hoặc nhập tay
set COMMIT_MSG=%*
if "%COMMIT_MSG%"=="" (
    set /p COMMIT_MSG="Nhap noi dung commit message: "
)
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=feat(eve): update 2FA OTP, course explanations, student arcade hub, and game SDK v2
)

echo.
echo [1/3] Dang them tat ca cac file thay doi (git add .)...
git add .

echo.
echo [2/3] Dang commit: "%COMMIT_MSG%"...
git commit -m "%COMMIT_MSG%"

echo.
echo [3/3] Dang push len GitHub remote (origin %CURRENT_BRANCH%)...
git push origin "%CURRENT_BRANCH%"

echo.
echo ========================================================
echo  [DONE] Dong bo va Push thanh cong len GitHub!
echo ========================================================
endlocal
