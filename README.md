# 임베디드 프로젝트

이 프로젝트는 Arduino와 Node.js를 사용한 화재 감지 및 쓰레기통 모니터링 시스템입니다.

## 프로젝트 구조

- `arduino/`: Arduino 코드
  - `arduino.ino`: 메인 Arduino 스케치 파일
- `backend/`: Node.js 서버 코드
  - `db.js`: 데이터베이스 연결 및 데이터 저장 로직

## 하드웨어 요구사항

- Arduino (WiFiS3 호환 보드)
- MQ-2 가스 센서
- 초음파 거리 센서
- LED (녹색, 노란색, 빨간색)
- 부저

## 소프트웨어 요구사항

- Node.js
- MySQL

## 설정 방법

1. Arduino 설정
   - `arduino.ino` 파일에서 WiFi 설정과 서버 IP 주소를 수정
   - Arduino IDE를 통해 코드 업로드

2. 백엔드 설정
   ```bash
   cd backend
   npm install
   ```

3. 데이터베이스 설정
   - MySQL에서 `imbeded` 데이터베이스 생성
   - `isfire` 테이블 생성:
     ```sql
     CREATE TABLE isfire (
       id int auto_increment primary key,
       timestamp datetime not null,
       status varchar(20) not null,
       location varchar(50) not null
     );
     ```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 