# DofusTouch No-Emu

Jouer à DofusTouch sans emulateur grâce à un portage entiérement en javascript via [electron](electron github), disponible en open source et cross-platform (OS X, Win, Linux)

#### DofusTouch No-Emu est un [Projet Open Source](http://openopensource.org/)

## À propos
DofusTouch No-Emu fonctionne sur :
 - Windows (32/64 bit)
 - OS X
 - Linux (x86/x86_64)

## Installation :
```sh
$ git clone https://github.com/scapain/dofustouch-noemu.git
$ npm install
```

## Lancement :
```sh
$ npm start
```

## Build Distribution :
```sh
$ npm run dist
```

### Docker :
```sh
$ docker-compose up
```

## Create Update :
Seulement les dossiers src et view ainsi que le package.json peuvent êtres mis à jours via l'updater
```sh
$ tar czvf update.tar.gz ./views ./src ./package.json
```

## Todos

 - Sauvegarde de plusieurs comptes via la sauvegarde de Frame
 - Amélioration des onglets
 - Création de raccoursis IG (accés Inventaire, carte, sorts, etc)
 - Raccourci pour aller sur l'onglet actif (onglet sur le quel c'est au tour du joueur)

License
----

GNU GPLv3 read [LICENCE](https://github.com/scapain/dofustouch-noemu/blob/master/LICENCE)
