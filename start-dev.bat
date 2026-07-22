@echo off
setlocal EnableExtensions

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

set "BACKEND_DIR=%ROOT_DIR%\src\backend"
set "FRONTEND_DIR=%ROOT_DIR%\src\frontend"
set "API_BASE_URL=http://localhost:8080/api/v1"
set "MEDIA_BASE_URL=http://localhost:8080"
set "FRONTEND_PM=npm"
set "CHECK_ONLY=0"

if /I "%~1"=="--check" set "CHECK_ONLY=1"

if not exist "%BACKEND_DIR%\main.go" (
	echo Backend entrypoint not found at "%BACKEND_DIR%\main.go".
	exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
	echo Frontend package.json not found at "%FRONTEND_DIR%\package.json".
	exit /b 1
)

where go >nul 2>nul
if errorlevel 1 (
	echo Go is required but was not found in PATH.
	exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
	echo Node.js is required but was not found in PATH.
	exit /b 1
)

where pnpm >nul 2>nul
if not errorlevel 1 set "FRONTEND_PM=pnpm"

if "%CHECK_ONLY%"=="1" (
	echo Dev environment looks ready.
	echo Backend:  %BACKEND_DIR%
	echo Frontend: %FRONTEND_DIR%
	echo Package manager: %FRONTEND_PM%
	exit /b 0
)

if not exist "%FRONTEND_DIR%\node_modules" (
	echo Frontend dependencies not found. Installing with %FRONTEND_PM%...
	pushd "%FRONTEND_DIR%"
	if /I "%FRONTEND_PM%"=="pnpm" (
		call pnpm install
	) else (
		call npm install
	)
	set "INSTALL_EXIT=%ERRORLEVEL%"
	popd
	if not "%INSTALL_EXIT%"=="0" (
		echo Frontend dependency installation failed.
		exit /b %INSTALL_EXIT%
	)
)

echo Starting backend on http://localhost:8080 ...
start "Casper Backend" cmd /k "cd /d "%BACKEND_DIR%" && set CORS_ALLOWED_ORIGINS=http://localhost:3000 && go run ."

echo Starting frontend on http://localhost:3000 ...
if /I "%FRONTEND_PM%"=="pnpm" (
	start "Casper Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && set VITE_API_BASE_URL=%API_BASE_URL% && set VITE_MEDIA_BASE_URL=%MEDIA_BASE_URL% && pnpm run dev"
) else (
	start "Casper Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && set VITE_API_BASE_URL=%API_BASE_URL% && set VITE_MEDIA_BASE_URL=%MEDIA_BASE_URL% && npm run dev"
)

echo Dev servers launched in separate terminals.
exit /b 0
