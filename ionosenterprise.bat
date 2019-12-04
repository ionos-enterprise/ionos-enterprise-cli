@echo off
set local=%cd%
chdir /d %PBCLI%
node ionosenterprise %*
chdir /d %local%
