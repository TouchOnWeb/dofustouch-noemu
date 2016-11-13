

export class Tab {
    constructor(id){
        this.id = id;
        this.ig = false;
        this.window = window['Frame'+this.id];
        this.Emulator = require('electron').remote.require('./Emulator');
    }

    init(){
        this.setEventListener();
        //this.window.gui._resizeUi();

    }

    setEventListener(){
        this.window.onresize = function() {
            this.window.gui._resizeUi();
        };

        this.window.gui.playerData.on("characterSelectedSuccess", () => {
            this.ig = true;
        });

        this.window.gui.on("disconnect", () => {
            this.ig = false;
        });

        this.window.key('a', function(){ alert('you pressed a!') });
    }
}
