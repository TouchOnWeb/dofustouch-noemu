const {app, dialog} = require('electron');
const {BrowserWindow} = require('electron');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const url = require('url');
const Emulator = require('./Emulator');
const jsonfile = require('jsonfile');
const MessageBox = require('./MessageBox');
const electronLocalshortcut = require('electron-localshortcut');

class Option {

    static show () {

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

        console.log(Emulator.devMode);


        this.winOption.loadURL(Emulator.dirView('option.html'));

        if (Emulator.devMode)
        this.winOption.webContents.openDevTools();

        app.on('shortcut-pressed', e => {
            console.log(
                e.shortcut, // the name of accelerator
                e.event // the custom name for the event or accelerator
            );
        })
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
