const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { startTCPServer, emitter } = require('./tcpserver');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",  // 실제 배포 시에는 특정 도메인으로 제한하는 것이 좋습니다
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,  // 60초
    pingInterval: 25000  // 25초
});

const tcpport = process.env.TCP_PORT || 3000;
const tcp = startTCPServer(tcpport);

// 연결된 클라이언트 관리
const connectedClients = new Map();

io.on('connection', (socket) => {
    console.log('클라이언트 연결됨:', socket.id);
    // 클라이언트 정보 저장
    connectedClients.set(socket.id, {
        connectedAt: new Date(),
        lastPing: new Date()
    });
    // 클라이언트로부터 ping 받음
    socket.on('ping', () => {
        const client = connectedClients.get(socket.id);
        if (client) {
            client.lastPing = new Date();
        }
    });
    // 연결 해제 시
    socket.on('disconnect', () => {
        console.log('클라이언트 연결 해제:', socket.id);
        connectedClients.delete(socket.id);
    });
});

// TCP 서버로부터 데이터를 받아 처리
emitter.on('data', (message) => {
<<<<<<< HEAD
    try {
        // 빈 데이터 체크
        if (!message || message.trim() === '') {
            console.log('빈 데이터 무시');
            return;
        }

        console.log('Arduino에서 받은 데이터:', message);
        
        // 데이터 형식 검증
        const data = typeof message === 'string' ? JSON.parse(message) : message;
        
        // 필수 필드 확인
        if (!data.location || typeof data.fill !== 'number' || typeof data.fire !== 'boolean') {
            throw new Error('잘못된 데이터 형식');
        }

        // 연결된 모든 클라이언트에게 데이터 전송
        io.emit('sensorData', {
            data: data,  // 이미 파싱된 데이터 객체를 직접 전송
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('데이터 처리 중 에러:', error);
    }
=======
    console.log('Arduino에서 받은 데이터:', message);
    
    // 연결된 모든 클라이언트에게 데이터 전송
    io.emit('sensorData', {
        data: message,
        timestamp: new Date().toISOString()
    });
>>>>>>> c67c65f7f2fdc1df1b904c144c7ec5de1155125c
});

const port = process.env.WS_PORT || 8000;
server.listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`WebSocket 서버가 포트 ${port}에서 실행 중입니다`);
});