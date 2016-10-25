const {app, BrowserWindow, Menu, ipc} = require('electron');
const url = require('url');
const os = require('os');

let Menu = [
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
                    ipc.send('newTab', '');
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
                }
            },
            {
                label: 'Fermer L\'Onglet',
                accelerator: 'CmdOrCtrl+W',
                click (item, focusedWindow) {
                    ipc.send('closeTab', '');
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
                    ipc.send('closeTab', '');
                }
            },
            {
                label: 'Montret Onglet Suivant',
                accelerator: 'Alt+Right',
                click (item, focusedWindow) {
                    ipc.send('closeTab', '');
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
    Menu.unshift({
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
    Menu[2].submenu.push(
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
    // Window menu.
    /*template[4].submenu = [
    {
    label: 'Fermer',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
},
{
label: 'Minimiser',
accelerator: 'CmdOrCtrl+M',
role: 'minimize'
},
{
label: 'Zoom',
role: 'zoom'
},
{
type: 'separator'
},
{
label: 'Envoyer devant',
role: 'front'
}
]*/
}

module.exports = Menu;
