const Updater = require('electron').remote.require('./Updater');
const emulator = require('electron').remote.require('./Emulator');
const {app} = require('electron').remote
const http = require('http');
const fs = require('fs');
const fsExtra = require('fs.extra');
const fstream = require('fstream');
const os = require('os');
const exec = require('child_process').exec;
const url = require('url');
const progress = require('request-progress');
const request = require('request');
const zlib = require('zlib');
const tar = require('tar');
const execSync = require('child_process').execSync;
const async = require('async');

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
        console.log(Updater.platform);
        this.downloadUpdate();
    }

    installUpdate(){

        this.updateProgressBarIndice('Installation de la mis à jour...');

        switch(process.platform){
            case 'linux':
            case 'darwin':
            console.log('start darwin update');
            exec('chmod a+x update.sh', function(error, stdout, stderr) {
                console.log(error);
                console.log(stdout);
                console.log(stderr);
                exec('./update.sh', function(error, stdout, stderr) {
                    console.log(error);
                    console.log(stdout);
                    console.log(stderr);
                });
            });
            break;
            case 'win32':
            exec('cmd.exe update.bat', function(error, stdout, stderr) {
                console.log(stdout);
            });
            break;
        }

        // remove old source
        /*fs.unlinkSync(`${__dirname}/../package.json`);
        fsExtra.rmrfSync(`${__dirname}/../views`);
        fsExtra.rmrfSync(`${__dirname}/../src`);

        console.log('start extract');

        let log = console.log;

        // extract update
        fs.createReadStream(this.toSaveFilePath)
        .on('error', log)
        .pipe(zlib.Unzip())
        .pipe(tar.Extract({ path: `${__dirname}/../`,strip: 0 }))
        .on('end', () => {
        // delete update file
        fs.unlinkSync(this.toSaveFilePath);

        // restart the app
        app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
        app.exit(0)
    });*/
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
        this.updateProgressBarIndice('Mise à jour terminée');
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
