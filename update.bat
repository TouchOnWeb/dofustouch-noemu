@echo off
rem --- Système d'updater de DofusTouch No-Emu ---
echo Installation de la Mise à jour de DofusTouch NoEmu
echo Ne pas fermer cette fenetre
echo (elle se fermera toute seule à la fin de l'instalation)

rem parametres
set chemin=%1
set prog=%2

echo Demande d'élévation de privileges
rem demande une elevation de privileges
if not exist "%chemin%\admin.lock" (
  rem mode con lines=2 cols=30
  echo a>"%chemin%\admin.lock"
	echo Appel du script de demande de droits admin
	call wscript "%chemin%\getadmin.vbs" "%chemin%" "%prog%"
	echo fin
  exit
  )
del /s "%chemin%\admin.lock" >NUL

echo Demande de droits admin réussie
rem tue le process DTNE
echo Terminaison des instances dejà lancées
taskkill /f /im %prog%.exe >NUL

echo Suppression des anciens fichiers
rem Suppression des fichiers à mettre à jour
del /s "%chemin%\package.json" >NUL
echo .
rd /s /q "%chemin%\src" >NUL
echo ..
rd /s /q "%chemin%\node_modules" >NUL
echo ...

rem Extraction
echo Extraction des nouveaux fichiers
if not exist "%chemin%\extract.vbs" (
	echo Erreur fichier "extract.vbs" manquant.
	echo Veuillez retélécharger le programme depuis le site.
	pause
	exit
)
cscript "%chemin%\extract.vbs" "%chemin%"

rem Suppression des fichiers temporaires
rem del extract.vbs

rem lancement du jeu
echo Lancement du jeu
start "" "%chemin%\..\..\%prog%.exe"

exit
