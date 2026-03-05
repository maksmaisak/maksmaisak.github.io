@echo off
REM ═══════════════════════════════════════════════════════════════════
REM  Metro Awakening Portfolio — Media Transcoding Script
REM  Place source files in the same directory as this .bat and run it.
REM  Requires: ffmpeg (https://ffmpeg.org/download.html) in PATH
REM ═══════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

set "OUT_DIR=images\metro_awakening"
if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║  Metro Awakening — Portfolio Media Transcoder    ║
echo ╠══════════════════════════════════════════════════╣
echo ║  Converts all .mp4/.mkv/.mov in this folder     ║
echo ║  into web-optimized formats.                    ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM ── Process videos (.mp4, .mkv, .mov) ─────────────────────────────
REM Encodes to H.264 web-friendly MP4 (capped at 720p, ~1-2 MB per 10s)
for %%F in (raw_video\*.mp4 raw_video\*.mkv raw_video\*.mov) do (
    echo [VIDEO] Transcoding: %%~nxF
    ffmpeg -y -i "%%F" ^
        -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" ^
        -c:v libx264 -preset slow -crf 28 -tune film ^
        -profile:v high -level 4.1 ^
        -movflags +faststart ^
        -pix_fmt yuv420p ^
        -an ^
        "%OUT_DIR%\%%~nF.mp4"
    echo [VIDEO] Done: %OUT_DIR%\%%~nF.mp4
    echo.
)

REM ── Process screenshots (.png, .bmp, .tga) ────────────────────────
REM Encodes to JPEG at quality 82 (good balance of quality vs size), max 1280px wide
for %%F in (raw_screenshot\*.png raw_screenshot\*.bmp raw_screenshot\*.tga) do (
    echo [IMAGE] Converting: %%~nxF
    ffmpeg -y -i "%%F" ^
        -vf "scale='min(1280,iw)':-2" ^
        -q:v 4 ^
        "%OUT_DIR%\%%~nF.jpg"
    echo [IMAGE] Done: %OUT_DIR%\%%~nF.jpg
    echo.
)

echo ══════════════════════════════════════════════════
echo  All done! Output files are in %OUT_DIR%
echo ══════════════════════════════════════════════════
pause
