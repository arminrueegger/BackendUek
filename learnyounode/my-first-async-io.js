const fs = require('fs');

const filePath = process.argv[2];

fs.readFile(filePath, function callback(err, data) {
    if (err) {
        console.error(err);
        return;
    }
    const fileString = data.toString();
    const lineCount = fileString.split('\n').length - 1;
    console.log(lineCount);
});
