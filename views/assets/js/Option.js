const {ipcRenderer} = require('electron');

let keycode = {

    getKeyCode : function(e) {
        var keycode = null;
        if(window.event) {
            keycode = window.event.keyCode;
        }else if(e) {
            keycode = e.which;
        }
        return keycode;
    },

    getKeyCodeValue : function(keyCode, shiftKey) {
        shiftKey = shiftKey || false;
        var value = null;
        if(shiftKey === true) {
            value = this.modifiedByShift[keyCode];
        }else {
            value = this.keyCodeMap[keyCode];
        }
        return value;
    },

    getValueByEvent : function(e) {
        return this.getKeyCodeValue(this.getKeyCode(e), e.shiftKey);
    },

    keyCodeMap : {
        8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"ctrl", 18:"alt", 19:"pausebreak", 20:"capslock", 27:"escape", 32:"space", 33:"pageup",
        34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 43:"+", 44:"printscreen", 45:"insert", 46:"delete",
        48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
        61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
        77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
        91:"cmd", 93:"cmd",
        96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9",
        106: "*", 107:"+", 109:"-", 110:".", 111: "/",
        112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
        144:"numlock", 145:"scrolllock", 186:";", 187:"=", 188:",", 189:"-", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"'"
    },

    modifiedByShift : {
        192:"~", 48:")", 49:"!", 50:"@", 51:"#", 52:"$", 53:"%", 54:"^", 55:"&", 56:"*", 57:"(", 109:"_", 61:"+",
        219:"{", 221:"}", 220:"|", 59:":", 222:"\"", 188:"<", 189:">", 191:"?",
        96:"insert", 97:"end", 98:"down", 99:"pagedown", 100:"left", 102:"right", 103:"home", 104:"up", 105:"pageup"
    }

};

class Option {

    constructor(){
        this.option  = require('electron').remote.require('./Option');
        this.emulator = require('electron').remote.require('./Emulator');
        this.$form = $('#right-menu');

        this.option.loadConfig((data) => {
            this.data = data;
            this.init();
        });
    }

    init(){
        this.keyBinder();
        this.formBinder();
        this.loadConfig();
    }

    formBinder(){
        let that = this;

        this.$form.on( 'submit', function( event ) {
            event.preventDefault();

            let obj = $( this ).serializeArray();

            that.parse(obj);

            return false;
        });
    }

    keyBinder(){
        var that = this;
        var keys = [];

        var keyPressed = function(keyCode) {
            keys.forEach(function(element, index) {
                if(element == keyCode){
                    delete keys[index];
                }
            });

            keys.push(keyCode);
        };

        var keyReleased = function(keyCode) {
            delete keys[keys.indexOf(keyCode)];
        };

        $( '.shortcut' ).keyup(function(e) {
            keyReleased(e.keyCode);
        });

        $( '.shortcut' ).keydown(function(e) {
            e.preventDefault();

            keyPressed(e.keyCode);

            let shortcut = '';

            let first = true;

            keys.forEach(function(element) {

                if(keys.length > 1 && !first){
                    shortcut += '+';
                }

                first = false;

                shortcut += keycode.getKeyCodeValue(element);
            });

            $(this).val(shortcut);

            return false;
        });
    }

    parse(obj){
        // delete old array
        this.data.option['shortcut']['no-emu']['tabs'] = [];
        this.data.option['shortcut']['spell'] = [];
        this.data.option['shortcut']['item'] = [];

        obj.forEach((element, index) => {
            let tabElement = element.name.split('.');

            if(tabElement.length == 3){
                if(Array.isArray(this.data.option[tabElement[0]][tabElement[1]][tabElement[2]])){
                    let ref = this.data.option[tabElement[0]][tabElement[1]][tabElement[2]];
                    ref.push(element.value);
                    this.data.option[tabElement[0]][tabElement[1]][tabElement[2]] = ref;

                }else{
                    this.data.option[tabElement[0]][tabElement[1]][tabElement[2]] = element.value;
                }
            }
            else if(tabElement.length == 2){
                if(Array.isArray(this.data.option[tabElement[0]][tabElement[1]])){
                    let ref = this.data.option[tabElement[0]][tabElement[1]];
                    ref.push(element.value);
                    this.data.option[tabElement[0]][tabElement[1]]= ref;
                }else{
                    this.data.option[tabElement[0]][tabElement[1]] = element.value;
                }
            }
        });
        this.saveConfig();
    }

    saveConfig(){
        this.option.saveConfig(this.data,() => {} );
    }

    loadConfig(){

        let properties = this.getPropertiesByKey(this.data.option, '');

        properties.forEach((propertie) => {
            let pathprop = propertie.split('.');

            // Value of option
            let value = this.data.option;
            pathprop.forEach((prop) => {
                value = value[prop];
            });

            if(!Array.isArray(value)){
                $( "input[name='"+propertie+"']" ).val(value);
            }else{
                value.forEach((n_value, n_index)=>{
                    $( "input[name='"+propertie+"']:eq("+n_index+")" ).val(n_value);
                });
            }
        });
    }

    keycode(){
        return {

            getKeyCode : function(e) {
                var keycode = null;
                if(window.event) {
                    keycode = window.event.keyCode;
                }else if(e) {
                    keycode = e.which;
                }
                return keycode;
            },

            getKeyCodeValue : function(keyCode, shiftKey) {
                shiftKey = shiftKey || false;
                var value = null;
                if(shiftKey === true) {
                    value = this.modifiedByShift[keyCode];
                }else {
                    value = this.keyCodeMap[keyCode];
                }
                return value;
            },

            getValueByEvent : function(e) {
                return this.getKeyCodeValue(this.getKeyCode(e), e.shiftKey);
            },

            keyCodeMap : {
                8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"ctrl", 18:"alt", 19:"pausebreak", 20:"capslock", 27:"escape", 32:"space", 33:"pageup",
                34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 43:"+", 44:"printscreen", 45:"insert", 46:"delete",
                48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
                61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
                77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
                91:"cmd", 93:"cmd",
                96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9",
                106: "*", 107:"+", 109:"-", 110:".", 111: "/",
                112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
                144:"numlock", 145:"scrolllock", 186:";", 187:"=", 188:",", 189:"-", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"'"
            },

            modifiedByShift : {
                192:"~", 48:")", 49:"!", 50:"@", 51:"#", 52:"$", 53:"%", 54:"^", 55:"&", 56:"*", 57:"(", 109:"_", 61:"+",
                219:"{", 221:"}", 220:"|", 59:":", 222:"\"", 188:"<", 189:">", 191:"?",
                96:"insert", 97:"end", 98:"down", 99:"pagedown", 100:"left", 102:"right", 103:"home", 104:"up", 105:"pageup"
            }

        };
    }

    getPropertiesByKey(object, key){

        let paths = [
        ];

        iterate(object, "");

        return paths;

        /**
        * Single object iteration. Accumulates to an outer 'paths' array.
        */
        function iterate(object, path) {
            let chainedPath;

            for (var property in object) {
                if (object.hasOwnProperty(property)) {

                    chainedPath =
                    path.length > 0 ?
                    path + "." + property :
                    path + property;

                    if (typeof object[property] == "object" && !Array.isArray(object[property])) {

                        iterate(object[property],chainedPath,chainedPath);
                    } else if (property === key || key.length === 0) {
                        paths.push(chainedPath);
                    }
                }
            }

            return paths;
        }
    }
}
