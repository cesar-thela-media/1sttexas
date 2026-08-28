@echo off
cd /d "%~dp0.."
call npm.cmd run:dev -- -p 4000
