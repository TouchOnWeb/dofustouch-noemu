@echo off
rem --- Système d'updater de DofusTouch No-Emu ---
rem tue le process DTNE
taskkill /f /im DofusTouchNE.exe

rem demande une elevation de privileges
cd /D %~dp0
if not exist "getadmin.vbs" (
    mode con lines=2 cols=30
    echo Set UAC = CreateObject^("Shell.Application"^)>getadmin.vbs
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >>getadmin.vbs
    call wscript getadmin.vbs
    exit
    )
del getadmin.vbs



rem charge utile:
echo Suppression des anciens fichiers
rem Suppression des fichiers à mettre à jour
del /s "%CD%\package.json"
rd /s /q "%CD%\src"
rd /s /q "%CD%\node_modules"

rem Extraction
echo Extraction des nouveaux fichiers
if not exist extract.vbs (
	echo Erreur fichier "extract.vbs" manquant.
	echo Veuillez retélécharger le programme depuis le site.
	pause
	exit
)
cscript extract.vbs

rem Suppression des fichiers temporaires
rem del extract.vbs

rem lancement du jeu
echo Lancement du jeu
call "%CD%/../../DofusTouchNE.exe"

exit
