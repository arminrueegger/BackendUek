const fs = require('node:fs');

function leseDateiInhalt(dateiPfad) {
    return new Promise((resolve, reject) => {
        fs.readFile(dateiPfad, (err, daten) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(daten.toString());
        });
    });
}

leseDateiInhalt('Beispiel.txt')
    .then(inhalt => { console.log('Die Länge des Dateiinhalts beträgt:', inhalt.length);
    })
    .catch(err => { console.error('Fehler beim Lesen der Datei:', err);
    });