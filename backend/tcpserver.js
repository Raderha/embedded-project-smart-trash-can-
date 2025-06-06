//TCP Server (tcpserver.js)
const net = require('net');
const EventEmitter = require('events');

const emitter = new EventEmitter();

function startTCPServer(port = 3000) {
    const tcpserver = net.createServer((socket) => {
        console.log('Client connected');

        socket.on('data', (data) => {
            const message = data.toString(); //아두이노에서 받은 거 문자열로 변경 후
            console.log(`Received: ${message}`); // 콘솔에 함 찍어주고
            emitter.emit('data', message); //server.js로 데이터 전송
        });

        socket.on('end', () => {
            console.log('Client disconnected');
        });

        socket.on('error', (err) => {
            console.error(`Socket error: ${err.message}`);
        });
    });

    tcpserver.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    return tcpserver;
}

module.exports = { startTCPServer, emitter };