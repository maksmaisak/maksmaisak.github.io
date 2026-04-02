@echo off
REM ═══════════════════════════════════════════════════════════════
REM  Render individual clip compositions only (no transcode).
REM  For full render + transcode, use render_all.bat instead.
REM ═══════════════════════════════════════════════════════════════

setlocal
set "OUT=..\images\metro_awakening"
if not exist "%OUT%" mkdir "%OUT%"

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║  Rendering Individual Clips                     ║
echo ╚══════════════════════════════════════════════════╝
echo.

for %%C in (
    perception-sight-fields
    cover-dynamic-safety
    enemy-human-combat
    enemy-nosalis
    enemy-lurker
    enemy-hunter
    rvo-avoidance
    stagger-hit-reactions
) do (
    echo Rendering %%C...
    call npx remotion render %%C "%OUT%\%%C.mp4"
    if errorlevel 1 echo [WARN] %%C failed — missing clip in public/?
)

echo.
echo ══════════════════════════════════════════════════
echo  Done. Output in %OUT%\
echo ══════════════════════════════════════════════════
pause
