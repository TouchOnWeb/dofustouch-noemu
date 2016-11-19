"use strict"
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const os = require('os');
const Emulator = require('./Emulator');


app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');

var win;

app.on('ready', function () {
    Emulator.init(win);
});

app.on('window-all-closed', () => {
    //if (process.platform !== 'darwin') {
        app.quit();
    //}
});

app.on('activate', () => {
    if (win === null) {
        Emulator.init(win);
    }
});

global.process = process;
