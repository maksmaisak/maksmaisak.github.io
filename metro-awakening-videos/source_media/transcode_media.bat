@echo off
REM ═══════════════════════════════════════════════════════════════════
REM  Metro Awakening Portfolio — Media Transcoding Script
REM  - Run directly to transcode all files from raw_video/ + raw_screenshot/
REM  - Or drag specific files / folders onto this .bat to transcode only those
REM  Requires: ffmpeg (https://ffmpeg.org/download.html) in PATH
REM ═══════════════════════════════════════════════════════════════════

setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "OUT_DIR=%SCRIPT_DIR%..\..\images\metro_awakening"
set "ANY_PROCESSED="

if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║  Metro Awakening — Portfolio Media Transcoder       ║
echo ╠══════════════════════════════════════════════════════╣
echo ║  No drag-drop args: transcode raw_video/raw_screenshot ║
echo ║  With args: only transcode dropped files/folders       ║
echo ╚══════════════════════════════════════════════════════╝
echo.

if "%~1"=="" (
    call :process_default_inputs
) else (
    goto process_dropped_inputs
)

if not defined ANY_PROCESSED (
    echo No supported media files were found.
)

echo.
echo ══════════════════════════════════════════════════
echo  Done. Output files are in:
echo  %OUT_DIR%
echo ══════════════════════════════════════════════════
pause
exit /b 0

:process_default_inputs
for %%F in ("%SCRIPT_DIR%raw_video\*.mp4" "%SCRIPT_DIR%raw_video\*.mkv" "%SCRIPT_DIR%raw_video\*.mov" "%SCRIPT_DIR%raw_video\*.avi") do (
    if exist "%%~fF" call :process_file "%%~fF"
)
for %%F in ("%SCRIPT_DIR%raw_screenshot\*.png" "%SCRIPT_DIR%raw_screenshot\*.bmp" "%SCRIPT_DIR%raw_screenshot\*.tga" "%SCRIPT_DIR%raw_screenshot\*.jpg" "%SCRIPT_DIR%raw_screenshot\*.jpeg") do (
    if exist "%%~fF" call :process_file "%%~fF"
)
exit /b 0

:process_dropped_inputs
if "%~1"=="" goto after_processing
if exist "%~1\*" (
    call :process_directory "%~1"
) else (
    call :process_file "%~1"
)
shift
goto process_dropped_inputs

:after_processing
if not defined ANY_PROCESSED (
    echo No supported media files were found.
)

echo.
echo ══════════════════════════════════════════════════
echo  Done. Output files are in:
echo  %OUT_DIR%
echo ══════════════════════════════════════════════════
pause
exit /b 0

:process_directory
set "DIR=%~1"
for %%F in ("%DIR%\*.mp4" "%DIR%\*.mkv" "%DIR%\*.mov" "%DIR%\*.avi" "%DIR%\*.png" "%DIR%\*.bmp" "%DIR%\*.tga" "%DIR%\*.jpg" "%DIR%\*.jpeg") do (
    if exist "%%~fF" call :process_file "%%~fF"
)
exit /b 0

:process_file
set "FILE=%~1"
set "EXT=%~x1"

if /I "%EXT%"==".mp4" goto process_video
if /I "%EXT%"==".mkv" goto process_video
if /I "%EXT%"==".mov" goto process_video
if /I "%EXT%"==".avi" goto process_video

if /I "%EXT%"==".png" goto process_image
if /I "%EXT%"==".bmp" goto process_image
if /I "%EXT%"==".tga" goto process_image
if /I "%EXT%"==".jpg" goto process_image
if /I "%EXT%"==".jpeg" goto process_image

echo [SKIP] Unsupported file: %FILE%
exit /b 0

:process_video
set "ANY_PROCESSED=1"
echo [VIDEO] Transcoding: %~nx1
ffmpeg -y -i "%FILE%" ^
    -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" ^
    -c:v libx264 -preset slow -crf 28 -tune film ^
    -profile:v high -level 4.1 ^
    -movflags +faststart ^
    -pix_fmt yuv420p ^
    -an ^
    "%OUT_DIR%\%~n1.mp4"
echo [VIDEO] Done: %OUT_DIR%\%~n1.mp4
echo.
exit /b 0

:process_image
set "ANY_PROCESSED=1"
echo [IMAGE] Converting: %~nx1
ffmpeg -y -i "%FILE%" ^
    -vf "scale='min(1280,iw)':-2" ^
    -q:v 4 ^
    "%OUT_DIR%\%~n1.jpg"
echo [IMAGE] Done: %OUT_DIR%\%~n1.jpg
echo.
exit /b 0