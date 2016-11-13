const electronLocalshortcut = require('electron-localshortcut');
const low = require('lowdb');
const async = require('async');
const fileAsync = require('lowdb/lib/file-async');

class ShortCuts {

    constructor(win){
        this.win = win;
        this.start = false;
        this.config = low('config.json', {
            storage: fileAsync
        });
    }

    init(){

        // tabs
        async.forEachOf(this.config.get('option.shortcut.no-emu.tabs').value(), (shortcut, index, callback) => {
            if(shortcut){
                electronLocalshortcut.register(this.win, this.convert(shortcut), (e) => {
                    this.win.webContents.send('spell', index);
                });
            }
            callback();
        }, (err) => {});

        // spell
        async.forEachOf(this.config.get('option.shortcut.spell').value(), (shortcut, index, callback) =>{
            if(shortcut){
                electronLocalshortcut.register(this.win, this.convert(shortcut), (e) => {
                    this.win.webContents.send('spell', index);
                });
            }
            callback();
        }, (err) => {});

        // item
        async.forEachOf(this.config.get('option.shortcut.item').value(), (shortcut, index, callback) =>{
            if(shortcut){
                electronLocalshortcut.register(this.win, this.convert(shortcut), (e) => {
                    this.win.webContents.send('item', index);
                });
            }
            callback();
        }, (err) => {});

        //interface
        async.forEachOf(this.config.get('option.shortcut.interface').value(), (shortcut, key, callback) =>{
            if(shortcut){
                electronLocalshortcut.register(this.win, this.convert(shortcut), (e) => {
                    this.win.webContents.send('interface', key);
                });
            }
            callback();
        }, (err) => {});

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
