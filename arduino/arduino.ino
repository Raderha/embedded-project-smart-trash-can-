#include <WiFiS3.h>
WiFiClient client;

// 핀 설정
#define MQ2_PIN A0
#define TRIG_PIN 9
#define ECHO_PIN 10
#define LED_GREEN 3
#define LED_YELLOW 4
#define LED_RED 5
#define BUZZER_PIN 6

// Wi-Fi 및 서버 정보
const char* ssid = "YourSSID";
const char* password = "YourPassword";
const char* server_ip = "192.168.0.100";  // Node.js 서버 IP
const int port = 3000;

// 설정값
const String location = "3층 A구역";  // 쓰레기통 위치
const int binHeight = 100;            // 쓰레기통 깊이 (단위: cm)
const int fireThreshold = 400;        // MQ-2 센서 화재 감지 임계값

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);

  // WiFi 연결
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi connected.");
}

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  long distance = duration * 0.034 / 2; // cm
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

  long distance = getDistance();
  int fillPercent = constrain((binHeight - distance) * 100 / binHeight, 0, 100);

  // 2. LED 표시
  displayFillLevel(fillPercent);

  // 3. 부저 울리기 (화재 감지 시)
  if (fire) {
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }

  // 4. JSON 전송
  if (client.connect(server_ip, port)) {
    String json = "{\"location\":\"" + location +
                  "\",\"fire\":" + (fire ? "true" : "false") +
                  ",\"fill\":" + String(fillPercent) + "}";
    client.println(json);
    Serial.println("Sent: " + json);
    client.stop();
  } else {
    Serial.println("서버 연결 실패");
  }

  delay(3000);
}