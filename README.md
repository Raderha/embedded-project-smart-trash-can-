# 임베디드 프로젝트

이 프로젝트는 Arduino와 Node.js, React Native를 사용한 화재 감지 및 쓰레기통 모니터링 시스템입니다.

## 프로젝트 구조

- `arduino/`: Arduino 코드
  - `arduino.ino`: 메인 Arduino 스케치 파일
- `backend/`: Node.js 서버 코드
  - `db.js`: 데이터베이스 연결 및 데이터 저장 로직
  - `tcpserver.js`: 아두이노와 연동 및 데이터를 수신하는 TCP서버
  - `server.js`: 메인 서버 코드
- `AppState/`: React Native App 코드
  - `HomeScreen.tsx`: 메인 App 코드
  - `BinDetailScreen.tsx`: 각 쓰레기통 상세 페이지 코드
  - `FloorScreen.tsx`: 각 층 현황 코드

## 하드웨어 요구사항

- Arduino (WiFiS3 호환 보드)
- MQ-2 가스 센서
- 초음파 거리 센서
- LED (녹색, 노란색, 빨간색)
- 부저

## 소프트웨어 요구사항

- Node.js
- MySQL
- React Native

## 설정 방법

1. Arduino 설정
   - `arduino.ino` 파일에서 WiFi 설정과 서버 IP 주소를 수정
   - Arduino IDE를 통해 코드 업로드

2. 백엔드 설정
   ```bash
     cd backend
     npm install
     설정 후 node server.js로 실행
   ```
   
3. 앱 설정
   ```bash
     cd AppState/smart-trashCan
     npm install
     설정 후 npx expo start로 실행 후 QR코드 스캔
   ```

4. 데이터베이스 설정
   - MySQL에서 `embeded` 데이터베이스 생성
   - `isfire` 테이블 생성:
     ```sql
       create table isfire (
        -> no int auto_increment not null primary key,
        -> date timestamp not null,
        -> locate varchar(30) not null,
        -> state int);
     );
     ```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 
