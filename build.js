"use strict"
const builder = require("electron-builder");
const Platform = builder.Platform

builder.build({
    platform: "win",
    arch: "all",
    devMetadata: {
        "build":{
            "copyright" : "Daniel LEFEVBRE",
            "productName" :"dofustouch-ne",
            "asar": false,
            "appId": "com.electron.${name}",
            "files": [

                "src/**/*",
                "node_modules/**/*",
                "package.json",
                "config.json",
                "LICENCE",
                "update.sh"
            ],
            "mac": {
                "target" : ["default", "dmg", "zip"],
                "category": "public.app-category.games"
            },
            "linux":{
                "target" : ["tar.gz", "deb"],
                "maintainer" : "Daniel LEFEVBRE",
            },
            "win": {
                "msi": true,
                "iconUrl": "http://dofustouch.no-emu.com/icon.ico"
            }
        }
    }
})
.then(() => {

})
.catch((error) => {
    // handle error
    console.log(error);
})
