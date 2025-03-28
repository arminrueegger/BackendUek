const url = process.argv[2];
const http = require('http');

http.get(url, function callback(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
        const fileString = data.toString();
        const splitString = fileString.split('\n');
        for (let i = 0; i < splitString.length; i++) {
            console.log(splitString[i]);
        }
    });
})