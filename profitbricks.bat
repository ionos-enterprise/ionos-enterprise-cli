@echo off
set local=%cd%
chdir /d %PBCLI%
node profitbricks %*
chdir /d %local%