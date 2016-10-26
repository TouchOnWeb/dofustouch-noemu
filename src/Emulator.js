const {app, BrowserWindow, Menu, ipcMain} = require('electron');

class Emulator {

    static dirView (file){
        return `file://${__dirname}/../views/`+file;
    }

    static openGameWindow (win) {

        win = new BrowserWindow({
            width: 900,
            height: 600,
            title : 'DofusTouch-NE',
            useContentSize: true,
            center: true
        });

        win.loadURL(Emulator.dirView('index.html'), {userAgent: 'Mozilla/5.0 (Linux; Android 6.0; FEVER Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.124 Mobile Safari/537.36'});

        if (this.gameWindows.length > 0)
            win.webContents.setAudioMuted(true);

        if (this.devMode)
            win.webContents.openDevTools();

        win.on('closed', () => {
            delete Emulator.gameWindows[Emulator.gameWindows.indexOf(win)];
            win = null;
        });

        this.gameWindows.push(win);

    }

    static setMenu  () {

        const template = [
            {
                label: 'Document',
                submenu: [
                    {
                        label: 'Nouvelle Fenetre',
                        accelerator: 'CmdOrCtrl+N',
                        click (item, focusedWindow) {
                            Emulator.openGameWindow();
                        }
                    },
                    {
                        label: 'Nouveau Onglet',
                        accelerator: 'CmdOrCtrl+T',
                        click (item, focusedWindow) {
                            focusedWindow.webContents.send('newTab', {});
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Fermer La Fenetre',
                        accelerator: 'Shift+CmdOrCtrl+W',
                        click (item, focusedWindow) {
                            //Emulator.openGameWindow();
                            focusedWindow.close();
                        }
                    },
                    {
                        label: 'Fermer L\'Onglet',
                        accelerator: 'CmdOrCtrl+W',
                        click (item, focusedWindow) {
                            focusedWindow.webContents.send('closeTab', {});
                        }
                    },
                ]
            },
            {
                label: 'Edition',
                submenu: [
                    {
                        role: 'undo'
                    },
                    {
                        role: 'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'cut'
                    },
                    {
                        role: 'copy'
                    },
                    {
                        role: 'paste'
                    },
                    {
                        role: 'delete'
                    },
                    {
                        role: 'selectall'
                    }
                ]
            },
            {
                label: 'Vue',
                submenu: [
                    {
                        label: 'Recharger',
                        accelerator: 'CmdOrCtrl+R',
                        click (item, focusedWindow) {
                            if (focusedWindow) focusedWindow.reload()
                        }
                    },
                    {
                        label: 'Toggle Developer Tools',
                        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                        click (item, focusedWindow) {
                            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Réinitialiser le zoom',
                        role: 'resetzoom'
                    },
                    {
                        label: 'Zoom +',
                        role: 'zoomin'
                    },
                    {
                        label: 'Zoom -',
                        role: 'zoomout'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Mode Plein Écran',
                        role: 'togglefullscreen'
                    }
                ]
            },
            {
                label: 'Fenetre',
                submenu: [
                    {
                        label: 'Montret Onglet Précédent',
                        accelerator: 'Alt+Left',
                        click (item, focusedWindow) {
                            focusedWindow.webContents.send('switchTab', 'prev');
                        }
                    },
                    {
                        label: 'Montret Onglet Suivant',
                        accelerator: 'Alt+Right',
                        click (item, focusedWindow) {
                            focusedWindow.webContents.send('switchTab', 'next');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        'label': 'Activer le son',
                        click(item, focusedWindow) {
                            focusedWindow.webContents.setAudioMuted(false);
                        }
                    },
                    {
                        'label': 'Désactiver le son',
                        click(item, focusedWindow) {
                            focusedWindow.webContents.setAudioMuted(true);
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'minimize'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'A propos',
                        click () {
                            require('electron').shell.openExternal('')
                        }
                    }
                ]
            }
        ];

        if (process.platform === 'darwin') {
            template.unshift({
                label: app.getName(),
                submenu: [
                    {
                        role: 'about'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'hide'
                    },
                    {
                        role: 'hideothers'
                    },
                    {
                        role: 'unhide'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'quit'
                    }
                ]
            })
            // Edit menu.
            template[2].submenu.push(
                {
                    type: 'separator'
                },
                {
                    label: 'Speech',
                    submenu: [
                        {
                            role: 'startspeaking'
                        },
                        {
                            role: 'stopspeaking'
                        }
                    ]
                }
            )

        }


        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    static init (win) {
        this.devMode = true;
        this.mainWindow = null;
        this.gameWindows = [];
        this.version = '0.0.1';
        this.webSite = 'http://dofustouch.no-emu.com';

        require('./Updater').init( () => {
            Emulator.setMenu();
            Emulator.openGameWindow(win);
        });
    }
}

module.exports = Emulator;
