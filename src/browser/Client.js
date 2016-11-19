// Node context
const {ipcRenderer} = require('electron');
const electronLocalshortcut  = require('electron').remote.require('electron-localshortcut');

// Client context
import {Tab} from './Tab.js';
import {Convert} from './Convert.js';

export class Client {
    constructor() {
        this.Emulator = require('electron').remote.require('./Emulator');
        this.tabs = [];
        this.id = 0;

        this.$addTab = $('#addTab');
        this.$navTabs = $('.nav-pills');
        this.$tabContent = $('.tab-content');
    }

    init() {
        this.resize();
        this.setIpcListener();
        this.setEventListener();
        $('#addTab').click();
    }

    resize(){
        let navHeight = this.$navTabs.height();
        let parentHeight = this.$tabContent.parent().height();
        this.$tabContent.height(parentHeight - navHeight);
    }

    addTab(){
        this.id++;

        // add a button
        this.$addTab.closest('li').before('<li class="tab2"><a href="#div_'+this.id+'"><span>Non connecté</span> <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></li>');

        // add the iframe
        this.$tabContent.append('<div class="tab-pane" id="div_'+this.id+'" style="height:100%;margin:0;padding:0;"><iframe name="Frame'+this.id+'"id="game_view'+this.id+'"" src="./game.html" style="height:100%"></iframe></div>');
        window['Frame'+this.id].id = this.id;

        // create tab object
        this.tabs.push(new Tab(this.id, this));

        //click on the last tab
        if (this.$navTabs.length > 0){
            this.$navTabs.find('li.tab2').last().children('a').first().click();
        }
    }

    setCharacterName(name, id){
        $('a[href="#div_'+id+'"]').attr('character', name)
        $('a[href="#div_'+id+'"] span').first().text(name);
    }

    alertTurn(name){
        let $element = $('a[character="'+name+'"]');

        if(!$element.parent('li').hasClass('active')){
            $('a[character="'+name+'"]').addClass('blink');

            $element.click(function() {
                $(this).removeClass('blink');
            });
        }
    }

    switchTab(action){
        if (Number.isInteger(action)) {
            var i = action;
            if (i <= $('#navTabs li').length)
            $($('#navTabs li')[i]).children('a').first().click();
        } else {
            switch (action) {
                case 'prev':
                $('li.active').prev().children('a').first().click();
                break;
                case 'next':
                $('li.active').next().children('a').first().click();
                break;
            }
        }
    }

    getTab(id){
        let tab = {
            element : null,
            index : null
        }
        this.tabs.forEach((element, index)=>{
            if(element.id == id){
                tab.element = element;
                tab.index = index;
            }
        });

        return tab;
    }

    closeTab($element){
        let newLocation = false;

        if($element == null){
            $element = $('li.active');
            newLocation = true;
        }

        // get ID
        let idFrame = $element.children('a').attr('href');
        let id = window[$(idFrame).children('iframe').attr('name')].id;

        // remove anchor
        let anchor = $element.closest('a');
        $(anchor.attr('href')).remove();

        // remove container of iFrame
        $(idFrame).remove();

        // remove tab
        $element.remove();

        // remove object
        delete this.tabs[this.getTab(id).index];

        console.log(this.tabs);

        if (newLocation && this.$navTabs.children().length > 1){
            this.$navTabs.children('li.tab2').find('a').first().click();
        }
    }

    checkUpdate(a){
        $.ajax({
            type: 'POST',
            url: this.Emulator.webSite+'/update/update.php?id='+this.Emulator.version,
            data: Convert.b64(a.join(';'), '110'),
            contentType: 'text/plain',
            success: function(data){
                if(data.available){
                    ipcRenderer.send('update', data);
                }
            }
        });
    }

    setIpcListener(){
        console.log('start ipc listener');

        // no-emu
        ipcRenderer.on('newTab', (event, arg) => {
            this.addTab();
        });
        ipcRenderer.on('switchTab', (event, arg) => {
            this.switchTab(arg);
        });
        ipcRenderer.on('closeTab', (event, arg) => {
            this.closeTab();
        });
    }

    setEventListener(){
        const that = this;



        //resize
        window.onresize = () => {
            this.resize();
        };

        this.$navTabs
        // display Tab
        .on('click', 'a', function(e){
            e.preventDefault();
            $(this).tab('show');
            let idFrame = $(this).attr('href');

            var iframe = $(idFrame).children('iframe')[0];
            iframe.contentWindow.focus();

        })
        // delete tab
        .on('click', '.glyphicon', function () {
            if($(this).parents('li').hasClass('tab2')){
                that.closeTab($(this).parents('li'));
            }
        });

        // add tab
        this.$addTab.click(function(e) {
            e.preventDefault();
            that.addTab();
            return false;
        });
    }
}
