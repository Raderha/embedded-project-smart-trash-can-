const mysql = require('mysql');

function connectDB() {
    const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'imbeded'
    });

    connection.connect();
    if (connection) {
        console.log('DB 연결 성공');
    } else {
        console.log('DB 연결 실패');
    }
    return connection;
}

function sendData(connection, data) {
    const parsedData = JSON.parse(data);
    
    // Only store data if fire is detected
    if (parsedData.fire === true) {
        const query = 'INSERT INTO isfire (timestamp, status, location) VALUES (NOW(), ?, ?)';
        connection.query(query, ['화재 감지', parsedData.location], (err, result) => {
            if (err) throw err;
            console.log('화재 감지 데이터 저장 성공');
        });
    }
}
    
function closeDB(connection) {
    connection.end();
}

module.exports = { connectDB, sendData, closeDB };