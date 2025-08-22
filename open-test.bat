@echo off
echo Opening Puffy test in browser...
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    "C:\Program Files\Google\Chrome\Application\chrome.exe" "%~dp0simple-test.html"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%~dp0simple-test.html"
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%~dp0simple-test.html"
) else (
    echo No browser found. Please manually open simple-test.html in your browser.
    pause
)