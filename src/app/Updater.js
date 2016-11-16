const {app, dialog} = require('electron');
const {BrowserWindow} = require('electron');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const url = require('url');
const Emulator = require('./Emulator');
const sudo = require('sudo-prompt');
const MessageBox = require('./MessageBox');
const exec = require('child_process').exec;

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

    static execUpdate(){

        let options = {
            name: 'electron',
        };

        switch(process.platform){
            case 'linux':
            case 'darwin':
            console.log('start unix update');
            exec('chmod a+x '+app.getAppPath()+'/update.sh', options, function(error, stdout, stderr) {
                sudo.exec(app.getAppPath()+'/update.sh '+app.getAppPath(), options, function(error, stdout, stderr) {
                    app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
                    app.exit(0)
                });
            });
            break;
            case 'win32':
            console.log('start win32 update');

            sudo.exec('cmd.exe '+app.getAppPath()+'/update.bat '+options.name+' '+app.getAppPath(), options, function(error, stdout, stderr) {
                app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
                app.exit(0)
            });

            /*const bat = spawn('cmd.exe', ['/c', app.getAppPath()+'/update.bat', options.name,  app.getAppPath()]);
            bat.stdout.on('data', (data) => {
            var str = String.fromCharCode.apply(null, data);
            console.info(str);
        });
        bat.stderr.on('data', (data) => {
        var str = String.fromCharCode.apply(null, data);
        console.error(str);
    });*/
    break;
}
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
