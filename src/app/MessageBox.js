const {app, dialog} = require('electron');
const {BrowserWindow} = require('electron');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const url = require('url');
const Emulator = require('./Emulator');

class MessageBox {

    static error(title, text){
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            type: 'error',
            title: title,
            message: text,
            buttons: ['Fermer']
        });
    }

}

module.exports = MessageBox;
