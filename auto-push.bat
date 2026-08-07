@echo off
setlocal enabledelayedexpansion

:: ==========================================
:: LUỒNG 1: CHUYỂN NHÁNH VÀ FETCH
:: ==========================================

:: Hỏi tên branch (var-1)
set /p BRANCH_NAME="Nhap ten branch cua ban (var-1): "

:: Chuyển sang branch đó, NẾU CHƯA CÓ thì tự động TẠO MỚI (-b)
echo.
echo [1/5] Dang chuyen sang branch hoac tao moi '%BRANCH_NAME%'...
git checkout "%BRANCH_NAME%" 2>nul || git checkout -b "%BRANCH_NAME%"

:: Fetch dữ liệu mới từ remote để cập nhật trạng thái mạng
echo.
echo [2/5] Dang fetch du lieu moi nhat tu origin...
git fetch origin

:: ==========================================
:: KIỂM TRA XEM NHÁNH MAIN CÓ GÌ MỚI KHÔNG
:: ==========================================
echo.
echo --- KIEM TRA CAC COMMIT MOI TREN ORIGIN/MAIN ---

:: Đếm số commit mới bằng cách truyền kết quả vào tìm kiếm dòng
set COMMIT_COUNT=0
for /f %%c in ('git log HEAD..origin/main --oneline 2^>nul ^| find /c /v ""') do set COMMIT_COUNT=%%c

if !COMMIT_COUNT! gtr 0 (
    echo [THONG BAO] Nhanh 'origin/main' dang co !COMMIT_COUNT! commit moi ma ban chua co:
    echo ----------------------------------------------------
    git log HEAD..origin/main --oneline --max-count=5
    if !COMMIT_COUNT! gtr 5 echo ... va mo so commit khac ben duoi.
    echo ----------------------------------------------------
) else (
    echo [THONG BAO] Nhanh hien tai cua ban da dong bo hoac khong co commit moi nao tu 'origin/main'.
)

:: ==========================================
:: BƯỚC HỎI CÓ MUỐN PULL KHÔNG
:: ==========================================
echo.
set /p PULL_CHOICE="Ban co muon pull (merge) code moi nhat tu 'origin/main' ve khong? (y/n): "

if /I "!PULL_CHOICE!"=="y" (
    echo.
    echo [3/5] Dang pull code tu 'origin/main' ve '%BRANCH_NAME%'...
    git pull origin main
) else (
    echo.
    echo [3/5] Bo qua buoc pull code tu main.
)

:: ==========================================
:: LUỒNG 2: ADD, COMMIT VÀ PUSH LÊN GITHUB
:: ==========================================

echo.
echo Tuyen trinh kiem tra main hoan tat. Tiep theo la luong commit code.
:: Hỏi commit message (var-2)
set /p COMMIT_MSG="Nhap commit message (var-2): "

:: Thêm tất cả thay đổi và commit
echo.
echo [4/5] Dang add va commit cac thay doi...
git add .
git commit -m "%COMMIT_MSG%"

:: Push nhánh hiện tại lên GitHub
echo.
echo [5/5] Dang push branch '%BRANCH_NAME%' len origin...
git push origin "%BRANCH_NAME%"

echo.
echo === Kich ban hoan thanh xuat sac! ===
pause
endlocal