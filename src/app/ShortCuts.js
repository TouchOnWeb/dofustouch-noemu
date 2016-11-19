const electronLocalshortcut = require('electron-localshortcut');
const async = require('async');
const fileAsync = require('lowdb/lib/file-async');
const {app} = require('electron');

const Emulator = require('./Emulator');

class ShortCuts {

    constructor(win, config){
        this.win = win;
        this.start = false;
        this.config = config;
    }

    init(){
        // tabs
        async.forEachOf(this.config.get('option.shortcut.no-emu.tabs').value(), (shortcut, index, callback) => {
            if(shortcut){
                electronLocalshortcut.register(this.win, ShortCuts.convert(shortcut), (e) => {
                    this.win.webContents.send('switchTab', index);
                });
            }
            callback();
        });
    }

    reload(){
        console.log('reload shortcuts');

        // reload shortcuts
        electronLocalshortcut.unregisterAll(this.win);
        this.init();

        // reload tab shortcuts
        this.win.webContents.send('reloadShotcuts');
    }

    enable(){
        if(!this.start){
            this.init()
        }else{
            electronLocalshortcut.enableAll(this.win);
        }
    }

    disable(){
        electronLocalshortcut.disableAll(this.win);
    }

    static convert(value){
        value = value.replace('ctrl', 'CmdOrCtrl');
        return value;
    }

}

module.exports = ShortCuts;
