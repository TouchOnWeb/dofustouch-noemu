const {ipcRenderer} = require('electron');

class Client {
    constructor() {
        this.Emulator = require('electron').remote.require('./Emulator');
        this.$addTab = $('#addTab');
        this.$navTabs = $('.nav-tabs');
        this.$tabContent = $('.tab-content');
        this.id = 0;
    }

    start() {
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
        this.$addTab.closest('li').before('<li class="tab2"><a href="#div_'+this.id+'"><span>Non connecté</span> <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></a></li>');

        // add the iframe
        this.$tabContent.append('<div class="tab-pane" id="div_'+this.id+'" style="height:100%;margin:0;padding:0;"><iframe name="Frame'+this.id+'"id="game_view'+this.id+'"" src="./game.html" style="height:100%"></iframe></div>');
        window['Frame'+this.id].id = this.id;

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
        switch(action){
            case 'prev':
            $('li.active').prev().children('a').first().click();
            break;
            case 'next':
            $('li.active').next().children('a').first().click();
            break;
        }
    }

    closeTab($element){
        let newLocation = false;

        if($element == null){
            $element = $('li.active');
            newLocation = true;
        }
        // remove anchor
        let anchor = $element.closest('a');
        $(anchor.attr('href')).remove();

        // remove iframe and div
        let idFrame = $element.children('a').attr('href');
        $(idFrame).remove();

        // remove tab
        $element.remove();

        if (newLocation && this.$navTabs.children().length > 1){
            this.$navTabs.children('li.tab2').find('a').first().click();
        }
    }

    checkUpdate(a){
        $.ajax({
            type: "POST",
            url: this.Emulator.webSite+"/update/update.php?id="+this.Emulator.version,
            data: Convert.b64(a.join(';'), '110'),
            contentType: "text/plain",
            success: function(data){
                if(data.available){
                    ipcRenderer.send('update', data);
                }
            }
        });
    }

    setIpcListener(){
        console.log('start ipc listener');
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
        .on("click", "a", function(e){
            e.preventDefault();
            $(this).tab('show');
        })
        // delete tab
        .on("click", ".glyphicon", function () {
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
