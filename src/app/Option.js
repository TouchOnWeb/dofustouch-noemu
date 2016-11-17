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

    static init (winParent, config) {

        if(this.winOption){
            this.winOption.focus();
            return;
        }

        this.config = config;
        this.winOption = new BrowserWindow({
            width: 710,
            height: 500,
            resizable: false,
            center: true,
            parent: winParent/*BrowserWindow.getFocusedWindow()*/,
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

    static save(){
        this.winOption.close();
        Emulator.reloadConfig();
    }
}

module.exports = Option;
