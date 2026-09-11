@echo off
setlocal
cd /d "%~dp0"

echo === Willowmere: installing dependencies ===
call npm install
if errorlevel 1 goto :failed

echo.
echo === Running simulation tests ===
call npm run test
if errorlevel 1 goto :failed

echo.
echo === Running lint ===
call npm run lint
if errorlevel 1 goto :failed

echo.
echo === Building production bundle ===
call npm run build
if errorlevel 1 goto :failed

echo.
echo === Starting Willowmere ===
echo Open http://localhost:5173 in your browser.
call npm run dev -- --host 127.0.0.1
goto :end

:failed
echo.
echo Willowmere could not start because a validation step failed.
pause
exit /b 1

:end
endlocal
