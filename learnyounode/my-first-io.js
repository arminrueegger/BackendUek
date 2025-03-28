const fs = require('fs');

const filePath = process.argv[2];

const fileContents = fs.readFileSync(filePath);

const fileString = fileContents.toString();

const lineCount = fileString.split('\n').length - 1;

console.log(lineCount);
