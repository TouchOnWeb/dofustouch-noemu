// Node Context
const low = require('lowdb');
const async = require('async');
const {app,shell} = require('electron').remote

export class Tab {
    constructor(id){
        this.id = id;
        this.ig = false;
        this.window = window['Frame'+this.id];
        this.Emulator = require('electron').remote.require('./Emulator');
        this.db = low(app.getAppPath()+'/config.json');
    }

    init(){
        this.setEventListener();
    }

    setEventListener(){
        // Resize windows
        this.window.onresize = function() {
            this.window.gui._resizeUi();
        };

        // Character IG
        this.window.gui.playerData.on("characterSelectedSuccess", () => {
            this.ig = true;
            this.bindShortCut();
            //if(rand() <= 1){
                setTimeout(()=>{
                    this.donateNotification();
                }, (30000+Math.random()*60000));
            //}
        });

        // Character Disconnect
        this.window.gui.on("disconnect", () => {
            console.log('disocnnect');
            this.unbindShortCut();
            this.ig = false;
        });
    }

    donateNotification(){
        let t = {
            type: this.window.gui.notificationBar.notificationType.INFORMATION,
            title: "DofusTouch No-Emu",
            text: "Tu aimes DofusTouch-NE ? Fais nous un don à la place marchande du zaap Astrub !",
            iconId: 23,
            iconColor: "blue",
            buttons: [{
                label: 'Plus d\'infos',
                action: function() {
                    shell.openExternal("http://forum.no-emu.com/viewtopic.php?f=3&t=16")
                }
            }]
        };
        this.window.gui.notificationBar.newNotification("Dons", t);
    }


    unbindShortCut(){
        // spell
        async.forEachOf(this.db.get('option.shortcut.spell').value(), (shortcut, index, callback) =>{
            this.window.key(shortcut);
            callback();
        });

        // item
        async.forEachOf(this.db.get('option.shortcut.item').value(), (shortcut, index, callback) =>{
            this.window.key(shortcut);
            callback();
        });

        //diver
        async.forEachOf(this.db.get('option.shortcut.diver').value(), (shortcut, key, callback) =>{
            this.window.key(shortcut);
            callback();
        });

        //interface
        async.forEachOf(this.db.get('option.shortcut.interface').value(), (shortcut, key, callback) =>{
            this.window.gui.menuBar._icons._childrenList.forEach((element, index) => {
                if(element.id.toUpperCase() == key.toUpperCase()){
                    this.window.key.unbind(shortcut);
                    return;
                }
            });
            callback();
        });
    }

    bindShortCut(){

        // spell
        async.forEachOf(this.db.get('option.shortcut.spell').value(), (shortcut, index, callback) =>{
            this.window.key(shortcut, () => {
                this.window.gui.shortcutBar.panels.spell.slotList[index].tap();
            });
            callback();
        });

        // item
        async.forEachOf(this.db.get('option.shortcut.item').value(), (shortcut, index, callback) =>{
            this.window.key(shortcut, () => {
                this.window.gui.shortcutBar.panels.item.slotList[index].tap();
            });
            callback();
        });

        //diver
        async.forEachOf(this.db.get('option.shortcut.diver').value(), (shortcut, key, callback) =>{
            this.window.key(shortcut, () => {

            });
            callback();
        });

        //interface
        async.forEachOf(this.db.get('option.shortcut.interface').value(), (shortcut, key, callback) =>{
            this.window.gui.menuBar._icons._childrenList.forEach((element, index) => {
                if(element.id.toUpperCase() == key.toUpperCase()){
                    this.window.key(shortcut, () => {
                        let newIndex = index;
                        this.window.gui.menuBar._icons._childrenList[newIndex].tap();
                    });
                    return;
                }
            });
            callback();
        });
    }
}
