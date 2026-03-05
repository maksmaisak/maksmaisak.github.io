@echo off
REM ═══════════════════════════════════════════════════════════════
REM  Render all montage compositions to ../images/metro_awakening/
REM  Run from the metro-awakening-videos directory.
REM  Requires: npm install (run once before first render)
REM ═══════════════════════════════════════════════════════════════

setlocal
set "OUT=..\images\metro_awakening"
if not exist "%OUT%" mkdir "%OUT%"

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║  Rendering Montages                             ║
echo ╚══════════════════════════════════════════════════╝
echo.

echo [1/5] HeroMontage...
call npx remotion render HeroMontage "%OUT%\hero_montage.mp4"
if errorlevel 1 echo [WARN] HeroMontage failed — missing clips in public/?

echo [2/5] PerceptionMontage...
call npx remotion render PerceptionMontage "%OUT%\perception_montage.mp4"
if errorlevel 1 echo [WARN] PerceptionMontage failed — missing clips in public/?

echo [3/5] CoverMontage...
call npx remotion render CoverMontage "%OUT%\cover_montage.mp4"
if errorlevel 1 echo [WARN] CoverMontage failed — missing clips in public/?

echo [4/5] CombatMontage...
call npx remotion render CombatMontage "%OUT%\combat_montage.mp4"
if errorlevel 1 echo [WARN] CombatMontage failed — missing clips in public/?

echo [5/5] AISystemsMontage...
call npx remotion render AISystemsMontage "%OUT%\ai_systems_montage.mp4"
if errorlevel 1 echo [WARN] AISystemsMontage failed — missing clips in public/?

echo.
echo ══════════════════════════════════════════════════
echo  Done. Output in %OUT%\
echo ══════════════════════════════════════════════════
pause
