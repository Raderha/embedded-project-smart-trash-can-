#include <WiFiS3.h>
WiFiClient client;

// 핀 설정
#define MQ2_PIN A0
#define TRIG_PIN 2
#define ECHO_PIN 3
#define LED_GREEN 7
#define LED_YELLOW 6
#define LED_RED 5
#define BUZZER_PIN 4

// Wi-Fi 및 서버 정보
const char* ssid = "TP-Link_2738";           // 와이파이 이름
const char* password = "88673325";   // 와이파이 비밀번호

// 서버 설정
// Node.js 서버가 실행되는 컴퓨터의 IP 주소를 사용
// ipconfig의 'IPv4 주소' 항목에서 확인
const char* server_ip = "192.168.0.18"; // Node.js 서버 IP 주소
const int port = 3000;                  // 서버 포트

// 설정값
const String location = "3층 A구역";   // 쓰레기통 위치
const int binHeight = 100;            // 쓰레기통 높이(cm)
const int fireThreshold = 400;        // 화재 감지 MQ-2 임계값

// 전역 변수로 클라이언트 연결 상태 관리
bool isConnected = false;
unsigned long lastConnectionAttempt = 0;
const unsigned long RECONNECT_INTERVAL = 5000; // 5초마다 재연결 시도

void setup() {
  Serial.begin(9600);
  Serial.println("\n시스템 시작...");
  Serial.println("WiFi 연결을 시도합니다...");
  Serial.print("SSID: ");
  Serial.println(ssid);

  // 핀모드 설정
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // 초음파 센서 초기화
  digitalWrite(TRIG_PIN, LOW);
  delay(100); // 초기화를 위한 대기
  Serial.println("핀 모드 설정 완료");

  // WiFi 연결
  WiFi.begin(ssid, password);
  
  unsigned long startAttemptTime = millis();
  int attempts = 0;
  
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 20000) { // 20초 타임아웃
    if (attempts % 4 == 0) { // 2초마다 상태 출력
      Serial.print("\nWiFi 연결 시도 중... (");
      Serial.print(attempts / 4 + 1);
      Serial.println("번째 시도)");
      Serial.print("현재 상태: ");
      switch(WiFi.status()) {
        case WL_IDLE_STATUS:
          Serial.println("대기 중");
          break;
        case WL_NO_SSID_AVAIL:
          Serial.println("SSID를 찾을 수 없음");
          break;
        case WL_CONNECT_FAILED:
          Serial.println("연결 실패");
          break;
        case WL_CONNECTION_LOST:
          Serial.println("연결 끊김");
          break;
        case WL_DISCONNECTED:
          Serial.println("연결 해제됨");
          break;
        default:
          Serial.println("알 수 없는 상태");
      }
    }
    Serial.print(".");
    delay(500);
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi 연결 성공!");
    Serial.print("IP 주소: ");
    Serial.println(WiFi.localIP());
    Serial.print("신호 강도: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\nWiFi 연결 실패!");
    Serial.println("다음 사항을 확인해주세요:");
    Serial.println("1. SSID가 정확한지 확인");
    Serial.println("2. 비밀번호가 정확한지 확인");
    Serial.println("3. WiFi 신호가 충분한지 확인");
  }
}

long getDistance() {
  // 초음파 센서 초기화
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // 에코 신호 대기 (타임아웃 증가)
  long duration = pulseIn(ECHO_PIN, HIGH, 100000); // 타임아웃 100ms로 증가
  
  // 유효하지 않은 측정값 처리
  if (duration == 0) {
    Serial.println("초음파 센서 측정 실패");
    return -1; // 에러 값 반환
  }
  
  // 거리 계산 (소리 속도 340m/s = 0.034cm/μs)
  long distance = duration * 0.034 / 2;
  
  // 비정상적인 거리값 필터링
  if (distance > 400 || distance < 2) { // 2cm ~ 400cm 범위 체크
    Serial.println("비정상적인 거리값 감지");
    return -1;
  }
  
  return distance;
}

void displayFillLevel(int percent) {
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);

  if (percent <= 33) {
    digitalWrite(LED_GREEN, HIGH);    // 0~33%: 거의 비어있음
  } else if (percent <= 66) {
    digitalWrite(LED_YELLOW, HIGH);   // 34~66%: 중간 정도
  } else {
    digitalWrite(LED_RED, HIGH);      // 67~100%: 거의 가득 참
  }
}

void loop() {
  // 1. 센서 값 읽기
  int mq2 = analogRead(MQ2_PIN);
  bool fire = mq2 > fireThreshold;
  Serial.print("MQ2 센서 값: ");
  Serial.println(mq2);

  long distance = getDistance();
  int fillPercent;
  
  if (distance == -1) {
    Serial.println("거리 측정 실패");
    fillPercent = 0;
  } else {
    fillPercent = constrain((binHeight - distance) * 100 / binHeight, 0, 100);
    Serial.print("거리: ");
    Serial.print(distance);
    Serial.print("cm, 채움률: ");
    Serial.print(fillPercent);
    Serial.println("%");
  }

  // 2. LED 표시
  displayFillLevel(fillPercent);

  // 3. 부저 울림
  digitalWrite(BUZZER_PIN, fire ? HIGH : LOW);

  // 4. 서버 연결 및 데이터 전송
  if (WiFi.status() == WL_CONNECTED) {
    // 연결이 끊어졌거나 처음 연결 시도하는 경우
    if (!isConnected && (millis() - lastConnectionAttempt >= RECONNECT_INTERVAL)) {
      Serial.print("서버 연결 시도 중... (");
      Serial.print(server_ip);
      Serial.print(":");
      Serial.print(port);
      Serial.println(")");
      
      if (client.connect(server_ip, port)) {
        Serial.println("서버 연결 성공!");
        isConnected = true;
      } else {
        Serial.println("서버 연결 실패");
        lastConnectionAttempt = millis();
      }
    }

    // 연결이 유지되고 있는 경우 데이터 전송
    if (isConnected && client.connected()) {
      String json = "{\"location\":\"" + location +
                    "\",\"fire\":" + (fire ? "true" : "false") +
                    ",\"fill\":" + String(fillPercent) +
                    ",\"mq2\":" + String(mq2) +
                    ",\"distance\":" + String(distance) + "}";
      client.println(json);
      Serial.println("전송됨: " + json);
    } else if (isConnected) {
      // 연결이 끊어진 경우
      Serial.println("서버와의 연결이 끊어짐");
      isConnected = false;
      lastConnectionAttempt = millis();
    }
  } else {
    Serial.println("WiFi 연결 끊김");
    isConnected = false;
  }

  delay(3000); // 3초마다 측정
}