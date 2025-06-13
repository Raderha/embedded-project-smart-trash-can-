//TCP Server (tcpserver.js)
const net = require('net');
const EventEmitter = require('events');
require('dotenv').config();

const emitter = new EventEmitter();

function startTCPServer(port = process.env.TCP_PORT || 3000) {
    console.log(`TCP 서버 시작 시도 - 포트: ${port}`);
    
    const tcpserver = net.createServer((socket) => {
        const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
        console.log(`클라이언트 연결됨 - ${clientAddress}`);
        console.log(`연결된 클라이언트 정보:`);
        console.log(`- IP 주소: ${socket.remoteAddress}`);
        console.log(`- 포트: ${socket.remotePort}`);
        console.log(`- 로컬 포트: ${socket.localPort}`);

        socket.on('data', (data) => {
            const message = data.toString();
            console.log(`클라이언트(${clientAddress})로부터 데이터 수신: ${message}`);
            emitter.emit('data', message);
        });

        socket.on('end', () => {
            console.log(`클라이언트 연결 종료 - ${clientAddress}`);
        });

        socket.on('error', (err) => {
            console.error(`소켓 에러 (${clientAddress}): ${err.message}`);
        });
    });

    tcpserver.on('error', (err) => {
        console.error(`서버 에러: ${err.message}`);
        if (err.code === 'EADDRINUSE') {
            console.error(`포트 ${port}가 이미 사용 중입니다.`);
        }
    });

    // 모든 네트워크 인터페이스에서 연결 수신
    tcpserver.listen(port, process.env.HOST || '0.0.0.0', () => {
        const address = tcpserver.address();
        console.log(`TCP 서버가 다음 주소에서 실행 중입니다:`);
        console.log(`- 주소: ${address.address}`);
        console.log(`- 포트: ${address.port}`);
        console.log(`- 프로토콜: ${address.family}`);
    });
    return tcpserver;
}

module.exports = { startTCPServer, emitter };