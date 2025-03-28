const http = require('http')
const bl = require('bl')

const urlOne = process.argv[2];
const urlTwo = process.argv[3];
const urlThree = process.argv[4];
let dataArray = ["","",""];
let count = 0;

http.get(urlOne, function (response) {
    response.pipe(bl(function (err, data) {
        if (err) {
            return console.error(err)
        }
        data = data.toString()
        dataArray[0] = data
        count++
        if(count === 3) {
            printResults()
        }
    }))
})
http.get(urlTwo, function (response) {
    response.pipe(bl(function (err, data) {
        if (err) {
            return console.error(err)
        }
        data = data.toString()
        dataArray[1] = data
        count++
        if(count === 3) {
            printResults()
        }
    }))
})
http.get(urlThree, function (response) {
    response.pipe(bl(function (err, data) {
        if (err) {
            return console.error(err)
        }
        data = data.toString()
        dataArray[2] = data
        count++
        if(count === 3) {
            printResults()
        }
    }))
})


function printResults() {
    console.log(dataArray[0])
    console.log(dataArray[1])
    console.log(dataArray[2])
}