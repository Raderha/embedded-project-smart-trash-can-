const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { startTCPServer, emitter } = require('./tcpserver');
const { connectDB, sendData, closeDB } = require('./db');

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

const tcpport = 3000;
const tcp = startTCPServer(tcpport);
const connection = connectDB();

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
    console.log('Arduino에서 받은 데이터:', message);
    
    // 연결된 모든 클라이언트에게 데이터 전송
    io.emit('sensorData', {
        data: message,
        timestamp: new Date().toISOString()
    });
});

const port = 8000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});