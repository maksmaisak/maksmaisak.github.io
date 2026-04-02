@echo off
REM Launch Remotion Studio in the default browser.

setlocal
pushd "%~dp0"
npx remotion studio
popd
