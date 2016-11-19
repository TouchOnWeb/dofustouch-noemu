const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const pkg = require('./../../package.json');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const os = require('os');

const MenuTemplate = require('./MenuTemplate');
const Game = require('./Game');


class Emulator {

    static dirView (file){
        return `file://${__dirname}/../view/`+file;
    }

    static init () {
        var self = this;
        Emulator.config = low(app.getAppPath()+'/config.json', {
            storage: fileAsync
        });
        Emulator.devMode = this.config.get('option.general.developer-mode').value();
        Emulator.gameWindows = [];
        Emulator.version = pkg.version;
        Emulator.webSite = 'http://dofustouch.no-emu.com';

        require('./Updater').init(() => {
            Emulator.setMenu();
            Emulator.openGameWindow();
        });
    }

    static reloadConfig(){
        Emulator.gameWindows.forEach((game) => {
            game.shortCuts.reload();
        });

        // reload menu
        Emulator.setMenu();
    }

    static openGameWindow () {

        // instance window game
        let game = new Game(Emulator.config, Emulator.devMode, Emulator);

        // start window game
        game.init();

        // remove game window if closed
        game.closed((e) => {
            delete Emulator.gameWindows[Emulator.gameWindows.indexOf(e)];
        });

        // if more than on windows mute the sound
        if (Emulator.gameWindows.length > 0){
            game.win.webContents.setAudioMuted(true);
        }

        // add the game window
        Emulator.gameWindows.push(game);
    }

    static setMenu  () {
        let template = MenuTemplate.build(Emulator.config, Emulator);
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
}

module.exports = Emulator;
