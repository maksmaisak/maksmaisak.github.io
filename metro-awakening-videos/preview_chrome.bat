@echo off
REM Launch Remotion preview in Chrome from this project folder.

setlocal
pushd "%~dp0"
npx remotion preview --browser=chrome
popd
