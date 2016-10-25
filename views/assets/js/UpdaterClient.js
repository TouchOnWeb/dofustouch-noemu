const updater = require('electron').remote.require('./updater');
const emulator = require('electron').remote.require('./emulator');
const http = require('http');
const fs = require('fs');
const os = require('os');
const exec = require('child_process').exec;
const url = require('url');

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

        //jQuery element
        this.progressBar = $('#progressBar');
        this.progressBarIndice = $('#progressBarIndice');
    }

    start(){
        this.downloadUpdate();
    }

    installUpdate(){
        let command = 'update.sh';


        switch (os.platform()) {
            case 'win32':
            case 'win64':
                command = 'update.bat';
            break;
            break;
            case 'linux':
            case 'darwin':
                command = 'update.sh';
            break;
        }

        exec(command, (error, stdout, stderr) => {
            console.log(stdout);
        });
    }

    downloadUpdate(){
        let len = 0;
        http.get(this.dataFile.file, (res) => {

            res.on('data', (chunk) => {
                this.file.write(chunk);
                len += chunk.length;

                let percent = Math.round((len / this.dataFile.size) * 100);

                this.updateProgressBar(percent);
                this.updateProgressBarIndice(UpdaterClient.formatDownloadUnit(len)+' / '+UpdaterClient.formatDownloadUnit(this.dataFile.size))
            });

            res.on('end', () => {
                this.file.close();
            });
        }).on('error', (e) => {
            this.updateProgressBarIndice('<span class="text-error">Impossible de télécharger la mise à jour ! Veuillez réessayer ultérieurement</span>');
        });

        this.file.on('close', () => {

            this.updateProgressBar(100);
            this.updateProgressBarIndice('Mise à jours terminé');

            this.installUpdate();
        })
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
