const updater = require('electron').remote.require('./Updater');
const emulator = require('electron').remote.require('./Emulator');
const process = require('electron').remote.getGlobal('process');
const {app} = require('electron').remote
const http = require('http');
const fs = require('fs');
const fstream = require('fstream');
const os = require('os');
const exec = require('child_process').exec;
const url = require('url');
const progress = require('request-progress');
const request = require('request');
const zlib = require('zlib');
const tar = require('tar');
const execSync = require('child_process').execSync;

class UpdaterClient {
    static formatDownloadUnit(count) {
        if (count >= 1000000) {
            return (Math.round((count / 1000000) * 100) / 100) + ' Mb';
        }
        else if (count >= 1000) {
            return (Math.round((count / 1000) * 100) / 100) + ' Kb';
        }
        else {
            return (Math.round(count * 100) / 100) + ' B';
        }
    }

    constructor(dataFile, toSaveFilePath, callback){

        //file info
        this.dataFile = dataFile;
        this.callback = callback;
        this.file = fs.createWriteStream(toSaveFilePath);
        this.toSaveFilePath = toSaveFilePath;

        //jQuery element
        this.progressBar = $('#progressBar');
        this.progressBarIndice = $('#progressBarIndice');
    }

    start(){
        this.downloadUpdate();
    }

    installUpdate(){

        /*exec(`chmod +rw ${__dirname}`, (error, stdout, stderr) => {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
        console.log(execSync(`rm -rf ${__dirname}/views`));
        execSync(`rm -rf ${__dirname}/node_modules`);
        execSync(`rm -rf ${__dirname}/src`);
        execSync(`tar xzvf ${__dirname}/../update.tar.gz`);
        exec(process.execPath+' ./');
        app.quit();
    });*/

    //app.quit();
    let log = console.log;
    fs.createReadStream(this.toSaveFilePath)
    .on('error', log)
    .pipe(zlib.Unzip())
    .pipe(tar.Extract({ path: `${__dirname}/../`,strip: 0 }))
    .on('end', () => {
        exec(process.execPath+' ./');
        app.quit();
    });
}

downloadUpdate(){

    progress(request(this.dataFile.file), {})
    .on('progress', (state) => {
        let percent = Math.round(state.percentage * 100);
        this.updateProgressBar(percent);
        this.updateProgressBarIndice(UpdaterClient.formatDownloadUnit(state.size.transferred)+' / '+UpdaterClient.formatDownloadUnit(state.size.total))
    })
    .on('error', (err) =>{
        this.updateProgressBarIndice('<span class="text-error">Impossible de télécharger la mise à jour ! Veuillez réessayer ultérieurement</span>');
    })
    .on('end', () =>{
        this.updateProgressBar(100);
        this.updateProgressBarIndice('Mise à jours terminé');
    })
    .pipe(this.file);

    this.file.addListener('finish', ()=>{
        this.installUpdate();
    });
}

updateProgressBar(percent){
    this.progressBar.css({
        width: percent + '%',
        ariaValuenow: percent
    });
}

updateProgressBarIndice(text){
    this.progressBarIndice.html(text);
}
}
