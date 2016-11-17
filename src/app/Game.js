const {BrowserWindow} = require('electron');
const ShortCuts = require('./ShortCuts');
const Emulator = require('./Emulator');

class Game {
    constructor(config, devMode, Emulator){
        this.Emulator = Emulator;
        this.devMode = devMode;
        this.config = config;
        this.win = new BrowserWindow({
            width: parseInt(this.config.get('option.general.resolution').value().split(';')[0]),
            height: parseInt(this.config.get('option.general.resolution').value().split(';')[1]),
            title : 'DofusTouch-NE',
            useContentSize: true,
            center: true,
            webPreferences: {
                pageVisibility: true,
                zoomFactor: 1.0
            }
        });
        this.shortCuts = new ShortCuts(this.win, this.config);
    }

    init(){
        // load default view and set user agent
        this.win.loadURL(this.Emulator.dirView('index.html'),
        {userAgent: 'Mozilla/5.0 (Linux; Android 6.0; FEVER Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.124 Mobile Safari/537.36'});

        // set shortcut for no-emu
        this.shortCuts.init();

        if (this.devMode){
            this.win.webContents.openDevTools();
        }
    }

    closed(cb){
        this.win.on('closed', () => {
            this.win = null;
            cb(this);
        });
    }

}

module.exports = Game;
