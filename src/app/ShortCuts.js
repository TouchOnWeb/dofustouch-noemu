const electronLocalshortcut = require('electron-localshortcut');
const low = require('lowdb');
const async = require('async');
const fileAsync = require('lowdb/lib/file-async');
const {app} = require('electron');

class ShortCuts {

    constructor(win){
        this.win = win;
        this.start = false;
        this.config = low(app.getAppPath()+'/config.json', {
            storage: fileAsync
        });
    }

    init(){
        // tabs
        async.forEachOf(this.config.get('option.shortcut.no-emu.tabs').value(), (shortcut, index, callback) => {
            if(shortcut){
                electronLocalshortcut.register(this.win, this.convert(shortcut), (e) => {
                    this.win.webContents.send('switchTab', index);
                });
            }
            callback();
        });
    }

    reload(){
        electronLocalshortcut.unregisterAll(this.win);
        this.init();
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

    convert(value){
        value = value.replace('ctrl', 'CmdOrCtrl');
        return value;
    }

    get(prop){
        return this.convert(this.config.get(prop).value());
    }

}

module.exports = ShortCuts;
