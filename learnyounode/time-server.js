const net = require('net')
const port = process.argv[2];

function zeroFill(number) {
    return (number < 10 ? '0' : '') + number
}
const date = new Date();
const year = date.getFullYear();
const month = zeroFill(date.getMonth() + 1);
const day = zeroFill(date.getDate());
const hours = zeroFill(date.getHours());
const minutes = zeroFill(date.getMinutes());

const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}\n`;

const server = net.createServer(function (socket) {
    socket.end(formattedDate)
})
server.listen(port)
