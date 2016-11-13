const {ipcRenderer} = require('electron');

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

            let obj = $( this ).serializeArray({ checkboxesAsBools: true });

            console.log(obj);

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

                shortcut += KeyCode.getKeyCodeValue(element);
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
