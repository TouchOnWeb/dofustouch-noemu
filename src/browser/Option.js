// Node Context
const {ipcRenderer} = require('electron');

// Browser Context
import {KeyCode} from './KeyCode.js'

export class Option {

    constructor(){
        this.option  = require('electron').remote.require('./Option');
        this.emulator = require('electron').remote.require('./Emulator');
        this.$form = $('#right-menu');

        this.data = this.option.config.value();
        this.init();
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

            let obj = $( this ).serializeArray({ checkboxesAsBools: true });

            console.log(obj);

            that.saveConfig(obj);

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

                shortcut += KeyCode.getKeyCodeValue(element);
            });

            $(this).val(shortcut);

            return false;
        });
    }

    saveConfig(obj){
        // delete old array
        this.option.config.set('option.shortcut.no-emu.tabs', []).value();
        this.option.config.set('option.shortcut.spell', []).value();
        this.option.config.set('option.shortcut.item', []).value();

        obj.forEach((element, index) => {
            if(Array.isArray(this.option.config.get('option.'+element.name).value())){
                this.option.config.get('option.'+element.name).push(element.value).value();
            }else{
                console.log(element.value);
                this.option.config.set('option.'+element.name, element.value).value();
            }
        });

        this.option.save();
    }

    loadConfig(){

        let properties = this.getPropertiesByKey(this.option.config.get('option').value(), '');

        properties.forEach((propertie) => {
            let pathprop = propertie.split('.');

            // Value of option
            let value = this.option.config.get('option').value();
            pathprop.forEach((prop) => {
                value = value[prop];
            });

            if(!Array.isArray(value)){

                // for checkbox
                if(typeof(value) === "boolean"){
                    $( "[name='"+propertie+"']" ).attr('checked', value);
                }else{
                    $( "[name='"+propertie+"']" ).val(value);

                }
            }else{
                value.forEach((n_value, n_index)=>{
                    $( "input[name='"+propertie+"']:eq("+n_index+")" ).val(n_value);
                });
            }
        });
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
