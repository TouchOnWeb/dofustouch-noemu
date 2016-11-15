const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const pkg = require('./../../package.json');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const ShortCuts = require('./ShortCuts');
const MenuTemplate = require('./MenuTemplate');
const autoUpdater = require('auto-updater');

class Emulator {

    static dirView (file){
        return `file://${__dirname}/../view/`+file;
    }

    static init (win) {
        var self = this;
        this.config = low('config.json', {
            storage: fileAsync
        });
        this.devMode = this.config.get('option.general.developer-mode').value();
        this.gameWindows = [];
        this.version = pkg.version;
        this.webSite = 'http://dofustouch.no-emu.com';

        this.win = new BrowserWindow({
            width: this.config.get('option.general.resolution').value().split(';')[0],
            height: this.config.get('option.general.resolution').value().split(';')[0],
            title : 'DofusTouch-NE',
            useContentSize: true,
            center: true
        });



        this.shortCuts = new ShortCuts(this.win);

        //require('./Updater').init( () => {
        Emulator.setMenu();
        Emulator.openGameWindow();
        //});
    }

    static openGameWindow () {

        // load default view and set user agent
        this.win.loadURL(Emulator.dirView('index.html'),
        {userAgent: 'Mozilla/5.0 (Linux; Android 6.0; FEVER Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.124 Mobile Safari/537.36'});

        // set shortcut for no-emu
        this.shortCuts.init();

        // if more than on windows mute the sound
        if (this.gameWindows.length > 0){
            win.webContents.setAudioMuted(true);
        }

        if (this.devMode){
            this.win.webContents.openDevTools();
        }

        // remove game window if closed
        this.win.on('closed', () => {
            delete this.gameWindows[this.gameWindows.indexOf(this.win)];
            this.win = null;
        });

        // add the game window
        this.gameWindows.push(this.win);
    }

    static setMenu  () {
        let template = MenuTemplate.build(this.shortCuts);
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
}

module.exports = Emulator;
