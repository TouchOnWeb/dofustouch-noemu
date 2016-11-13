const {app, dialog} = require('electron');
const {BrowserWindow} = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const url = require('url');
const jsonfile = require('jsonfile');

const Emulator = require('./Emulator');
const MessageBox = require('./MessageBox');

class Option {

    static init () {

        this.config = './config.json';
        this.winOption = new BrowserWindow({
            width: 700,
            height: 500,
            resizable: Emulator.devMode,
            center: true,
            parent: BrowserWindow.getFocusedWindow(),
            darkTheme: true,
            skipTaskbar: true,
        });
        this.winOption.on('closed', () => {
            this.winOption = null
        });
        this.winOption.loadURL(Emulator.dirView('option.html'));

        if (Emulator.devMode){
            this.winOption.webContents.openDevTools();
        }
    }

    static loadConfig(cb){
        jsonfile.readFile(this.config, function(err, obj) {
            if (err){
                MessageBox.error('Erreur', err.message);
                return;
            }
            cb(obj);
        });
    }

    static saveConfig(obj, cb){
        jsonfile.writeFile(this.config, obj,{spaces: 4}, function (err) {
            if (err){
                MessageBox.error('Erreur', err.message);
                return;
            }
        });
    }
}

module.exports = Option;
