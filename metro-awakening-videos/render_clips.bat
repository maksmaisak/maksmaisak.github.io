@echo off
REM ═══════════════════════════════════════════════════════════════
REM  Render all individual clip compositions to ../images/metro_awakening/
REM  Run from the metro-awakening-videos directory.
REM  Requires: npm install (run once before first render)
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
    perception-darkness
    perception-projectile
    perception-debugging
    cover-dynamic-safety
    ai-state-machine
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
