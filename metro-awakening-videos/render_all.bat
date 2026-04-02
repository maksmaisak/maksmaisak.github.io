@echo off
REM ═══════════════════════════════════════════════════════════════
REM  Render all compositions via Remotion, then transcode each to
REM  three web formats (AV1, HEVC, H.264) via ffmpeg.
REM
REM  Output goes to ..\images\metro_awakening\
REM  Run from the metro-awakening-videos directory.
REM  Requires: npm install (once), ffmpeg on PATH
REM ═══════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

set "OUT=..\images\metro_awakening"
set "MASTERS=%TEMP%\metro_masters"
if not exist "%OUT%" mkdir "%OUT%"
if not exist "%MASTERS%" mkdir "%MASTERS%"

REM ── Check ffmpeg ────────────────────────────────────────────
where ffmpeg >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ffmpeg not found on PATH. Install it first.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════
echo   Metro Awakening — Render ^& Transcode Pipeline
echo ════════════════════════════════════════════════════
echo.

REM ── Discover all composition IDs from Remotion ─────────────
echo Discovering compositions...
for /f "tokens=*" %%I in ('npx remotion compositions --quiet 2^>nul') do (
    set "COMP_ID=%%I"
    echo.
    echo ── Rendering !COMP_ID! ──────────────────────────

    REM Render master (high-quality H.264)
    call npx remotion render "!COMP_ID!" "%MASTERS%\!COMP_ID!.mp4" --codec h264 --crf 16
    if errorlevel 1 (
        echo [WARN] !COMP_ID! render failed — skipping transcode.
    ) else (
        call :transcode "!COMP_ID!"
    )
)

echo.
echo ════════════════════════════════════════════════════
echo   Done. Output in %OUT%\
echo ════════════════════════════════════════════════════
pause
exit /b 0

REM ── Transcode subroutine ───────────────────────────────────
:transcode
set "ID=%~1"
set "MASTER=%MASTERS%\%ID%.mp4"

echo   → AV1 ...
ffmpeg -y -hide_banner -loglevel warning -i "%MASTER%" ^
  -c:v libaom-av1 -crf 32 -b:v 0 -cpu-used 4 -row-mt 1 -an ^
  "%OUT%\%ID%.av1.mp4"

echo   → HEVC ...
ffmpeg -y -hide_banner -loglevel warning -i "%MASTER%" ^
  -c:v libx265 -crf 28 -preset medium -tag:v hvc1 -an ^
  "%OUT%\%ID%.hevc.mp4"

echo   → H.264 ...
ffmpeg -y -hide_banner -loglevel warning -i "%MASTER%" ^
  -c:v libx264 -crf 23 -preset medium -an ^
  "%OUT%\%ID%.mp4"

exit /b 0
