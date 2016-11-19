#!/bin/bash
#Script de Maj de DofusTouch NoEmu
echo App Path : $1
echo Terminaison des instances de DofusTouch-NE lancées
#pkill dofustouch-ne
echo Suppression des vieux fichiers
rm -rf $1/package.json
rm -rf $1/src
rm -rf $1/node_modules
echo Extraction des nouveaux fichiers
tar -xvf $1/update.tar.gz -C $1
echo Lancement du jeu
#../../MacOS/dofustouch-ne
