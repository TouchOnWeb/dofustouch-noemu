// Node Context
const low = require('lowdb');
const async = require('async');
const {app,shell} = require('electron').remote
const {ipcRenderer} = require('electron');

export class Tab {
    constructor(id, client){
        this.client = client;
        this.id = id;
        this.ig = false;
        this.window = window['Frame'+this.id];
        this.Emulator = require('electron').remote.require('./Emulator');
        this.config = this.Emulator.config;
    }

    init(){
        this.setEventListener();
    }

    hideShop(){
        if(this.config.get('option.general.hidden-shop').value()){
            $(this.window.document).find('.shopBtn.Button').parent().hide();
        }else{
            $(this.window.document).find('.shopBtn.Button').parent().show();
        }
    }

    setEventListener(){

        // Resize windows
        this.window.onresize = function() {
            this.window.gui._resizeUi();
        };

        //
        ipcRenderer.on('reloadShotcuts', (event, arg) => {
            console.log('reloadShotcuts')
            if(this.ig){
                this.unbindShortCut();
                this.bindShortCut();
                this.hideShop();
            }
        });

        // Character IG
        this.window.gui.playerData.on("characterSelectedSuccess", ()=> {
            console.log('connect char');
            this.ig = true;

            //hide shop?
            this.hideShop();

            // set character name tab
            this.client.setCharacterName(this.window.gui.playerData.characterBaseInformations.name, this.id);

            // Set shortcut
            this.bindShortCut();

            // Set donate
            if(Math.random() <= 0.2){
                setTimeout(()=>{
                    this.donateNotification();
                }, (30000+Math.random()*60000));
            }
        });

        // Character Disconnect
        this.window.gui.on("disconnect", () => {
            this.unbindShortCut();
            self.client.setCharacterName('Non connecté', this.id);
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

        this.window.key.unbind(this.config.get('option.shortcut.diver.end-turn').value());

        // spell
        async.forEachOf(this.config.get('option.shortcut.spell').value(), (shortcut, index, callback) =>{
            this.window.key.unbind(shortcut);
            callback();
        });

        // item
        async.forEachOf(this.config.get('option.shortcut.item').value(), (shortcut, index, callback) =>{
            this.window.key.unbind(shortcut);
            callback();
        });

        //diver
        async.forEachOf(this.config.get('option.shortcut.diver').value(), (shortcut, key, callback) =>{
            this.window.key.unbind(shortcut);
            callback();
        });

        //interface
        async.forEachOf(this.config.get('option.shortcut.interface').value(), (shortcut, key, callback) =>{
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
        console.log(this.config.get('option.shortcut.diver.end-turn').value());
        // end turn
        this.window.key(this.config.get('option.shortcut.diver.end-turn').value(), () => {
            console.log('end turn');
            this.window.turnReady.tap();
        });


        // spell
        async.forEachOf(this.config.get('option.shortcut.spell').value(), (shortcut, index, callback) =>{
            this.window.key(shortcut, () => {
                this.window.gui.shortcutBar.panels.spell.slotList[index].tap();
            });
            callback();
        });

        // item
        async.forEachOf(this.config.get('option.shortcut.item').value(), (shortcut, index, callback) =>{
            this.window.key(shortcut, () => {
                this.window.gui.shortcutBar.panels.item.slotList[index].tap();
            });
            callback();
        });

        //diver
        async.forEachOf(this.config.get('option.shortcut.diver').value(), (shortcut, key, callback) =>{
            this.window.key(shortcut, () => {

            });
            callback();
        });

        //interface
        async.forEachOf(this.config.get('option.shortcut.interface').value(), (shortcut, key, callback) =>{
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
