@echo off
echo 🚀 Starting Smart Dashboard Build Process...

REM Create dist directory
echo 📁 Creating dist directory...
if not exist dist mkdir dist

REM Copy files to dist
echo 📋 Copying files to dist...
xcopy /E /I /Y index.html dist\ >nul 2>&1
xcopy /E /I /Y css dist\css\ >nul 2>&1
xcopy /E /I /Y js dist\js\ >nul 2>&1
if exist assets xcopy /E /I /Y assets dist\assets\ >nul 2>&1

REM Create version file
echo 📝 Creating version file...
echo Build Date: %date% %time% > dist\BUILD_INFO.txt
echo Commit: %GITHUB_SHA% >> dist\BUILD_INFO.txt

echo ✅ Build completed successfully!
echo 📦 Files are ready in the dist\ directory
pause
