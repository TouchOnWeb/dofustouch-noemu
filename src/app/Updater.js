const {app, dialog} = require('electron');
const {BrowserWindow} = require('electron');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const url = require('url');
const Emulator = require('./Emulator');

class Updater {

    static failedCheckUpdates(){
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            type: 'error',
            title: 'Error',
            message: 'Impossible de vérifier les mises à jours...\nVérifiez votre connexion à Internet.',
            buttons: ['Fermer']
        });
    }

    static checkUpdate(){

        let queries = '?version=' + app.getVersion();
        http.get(url.resolve(Emulator.webSite, 'update/update.php' + queries), (res) => {

            if (!res || !res.statusCode || res.statusCode != 200) {

                this.failedCheckUpdates();
            } else {
                let body = '';

                // get data
                res.on('data', (chunk) => {
                    body += chunk;
                });

                // parse data
                res.on('end', () => {

                    Updater.responseBody = JSON.parse(body);

                    if (Updater.responseBody.version || Emulator.devMode) {

                        if (Updater.responseBody.version != Emulator.version /*|| Emulator.devMode*/) {

                            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                                type: 'info',
                                title: 'Nouvelle version : ' + Updater.responseBody.version,
                                message: 'Une nouvelle version est disponible de DofusTouchNoEmu!\n',
                                buttons: ['Télécharger', 'Ignorer']
                            }, (buttonIndex) => {
                                if(buttonIndex == 0){
                                    Updater.startUpdate();
                                }else{
                                    Updater.startGame();
                                }
                            });
                        }else{
                            Updater.startGame();
                        }
                    } else {
                        this.failedCheckUpdates();
                    }
                });
            }
        }).on('error', this.failedCheckUpdates);
    }

    static getUserHome() {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    static startUpdate (i) {

        Updater.toSaveFilePath = app.getAppPath()+'/update.tar.gz';

        var winUpdate = new BrowserWindow({
            width: 700,
            height: 150,
            //modal: false,
            //resizable: Emulator.devMode,
            center: true,
            parent: BrowserWindow.getFocusedWindow(),
            //darkTheme: true,
            //skipTaskbar: true,
            //frame: false
        });

        winUpdate.on('closed', () => {
            winUpdate = null
        });

        winUpdate.loadURL(Emulator.dirView('updater.html'));

        if (Emulator.devMode)
            winUpdate.webContents.openDevTools();
    }

    static init (startGame) {
        Updater.startGame = startGame;
        this.checkUpdate();
    }
}

module.exports = Updater;
