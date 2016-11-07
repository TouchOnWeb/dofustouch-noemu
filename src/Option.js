const {app, dialog} = require('electron');
const {BrowserWindow} = require('electron');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const url = require('url');
const Emulator = require('./Emulator');

class Option {

    static show () {

        var winUpdate = new BrowserWindow({
            width: 700,
            height: 500,
            resizable: Emulator.devMode,
            center: true,
            parent: BrowserWindow.getFocusedWindow(),
            darkTheme: true,
            skipTaskbar: true,
        });

        winUpdate.on('closed', () => {
            winUpdate = null
        });

        console.log(Emulator.devMode);


        winUpdate.loadURL(Emulator.dirView('option.html'));

        if (Emulator.devMode)
            winUpdate.webContents.openDevTools();
    }

}

module.exports = Option;
