const mysql = require('mysql2/promise');

// DB 연결 풀 생성
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'embeded'
});

async function connectDB() {
    try {
        const connection = await pool.getConnection();
        console.log('DB 연결 성공');
        connection.release();
        return true;
    } catch (error) {
        console.error('DB 연결 실패:', error);
        return false;
    }
}

async function saveFireData(data) {
    try {
        // fire가 true일 때만 저장
        if (data.fire) {
            const connection = await pool.getConnection();
            
            const query = `
                INSERT INTO isfire (date, locate, state) 
                VALUES (CURRENT_TIMESTAMP, ?, ?)
            `;
            
            const values = [
                data.location,
                data.mq2
            ];
            
            console.log('화재 감지 데이터 저장 시도:', values);
            
            await connection.execute(query, values);
            connection.release();
            
            console.log('화재 감지 데이터 저장 완료:', {
                location: data.location,
                mq2: data.mq2,
                timestamp: new Date()
            });
        }
    } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error);
    }
}

function closeDB(connection) {
    connection.end();
}

module.exports = { connectDB, saveFireData, pool };