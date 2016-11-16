"use strict"
const builder = require("electron-builder")
const Platform = builder.Platform

// Promise is returned
builder.build({
    platform: "win",
    arch: "all",
    devMetadata: {
        "build":{
            "copyright" : "Daniel LEFEVBRE",
            "productName" :"DofusTouchNE",
            "asar": false,
            "appId": "com.electron.${name}",
            "files": [
                "src/**/*",
                "node_modules/**/*",
                "package.json",
                "config.json",
                "LICENCE",
                "update.sh",
                "update.bat",
                "extract.vbs"
            ],
            "mac": {
                "target" : ["default"],
                "category": "public.app-category.games"
            },
            "linux":{
                "executableName": "DofusTouchNE",
                "target" : ["tar.gz"],
                "maintainer" : "Daniel LEFEVBRE",
            },
            "win": {
                "target" : "zip",
                "iconUrl": "http://dofustouch.no-emu.com/icon.ico"
            }
        }
    }
})
.then(() => {
    console.log('Build FINSH');
})
.catch((error) => {
    // handle error
})
