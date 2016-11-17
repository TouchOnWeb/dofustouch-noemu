const {app, ipcMain} = require('electron');
const ShortCuts = require('./ShortCuts');

class MenuTemplate {

    static build(config, Emulator){

        const template = [
            {
                label: 'Document',
                submenu: [
                    {
                        label: 'Nouvelle Fenetre',
                        accelerator: ShortCuts.convert(config.get('option.shortcut.no-emu.new-window').value()),
                        click (item, focusedWindow) {
                            Emulator.openGameWindow();
                        }
                    },
                    {
                        label: 'Nouveau Onglet',
                        accelerator: ShortCuts.convert(config.get('option.shortcut.no-emu.new-tab').value()),
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
                        accelerator: ShortCuts.convert(config.get('option.shortcut.no-emu.prev-tab').value()),
                        click (item, focusedWindow) {
                            focusedWindow.webContents.send('switchTab', 'prev');
                        }
                    },
                    {
                        label: 'Montret Onglet Suivant',
                        accelerator: ShortCuts.convert(config.get('option.shortcut.no-emu.next-tab').value()),
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
                label:'Paramètres',
                submenu: [
                    {
                        label: 'Options',
                        click (item, focusedWindow) {
                            require('./Option').init(focusedWindow, config)
                        }
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
            this.darwin(template);
        }

        return template;
    }

    static darwin(template){
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
}

module.exports = MenuTemplate;
