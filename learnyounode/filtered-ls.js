const pathToDir = process.argv[2];
const rawFilter = process.argv[3];
const filter = "." + rawFilter;
const fs = require('fs');
fs.readdir(pathToDir, function callback(err, list) {
    if (err) {
        console.error(err);
        return;
    }
    list.forEach(function(file) {
        if (file.endsWith(`${filter}`)) {
            console.log(file);
        }
    });
})