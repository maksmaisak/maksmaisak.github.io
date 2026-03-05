@echo off
REM ═══════════════════════════════════════════════════════════════
REM  Render everything (montages + individual clips)
REM ═══════════════════════════════════════════════════════════════

call "%~dp0render_montages.bat"
call "%~dp0render_clips.bat"
