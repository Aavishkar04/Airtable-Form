@echo off
echo Starting Airtable Form Builder...
echo.

echo Installing dependencies...
call npm install
cd server && call npm install
cd ../client && call npm install
cd ..

echo.
echo Starting servers...
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo Servers starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul