import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { TrashBinContext } from '../context/TrashBinContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import AlertContainer from '../components/AlertContainer';
import io from 'socket.io-client';

interface SensorData {
  location: string;
  fire: boolean;
  fill: number;
  mq2: number;
  distance: number;
}

export default function HomeScreen({ navigation }: any) {
  const { bins, updateBin } = useContext(TrashBinContext);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // WebSocket 연결
    const newSocket = io('http://192.168.0.18:8000');
    setSocket(newSocket);

    // 데이터 수신 이벤트 리스너
    newSocket.on('sensorData', (data: { data: SensorData }) => {
      console.log('센서 데이터 수신:', data);
      try {
        if (!data.data || !data.data.location) {
          console.warn('잘못된 데이터:', data);
          return;
        }
        updateBin({
          id: data.data.location,
          floor: data.data.location.split(' ')[0],
          location: data.data.location,
          fillLevel: data.data.fill,
          isFireDetected: data.data.fire,
          status: data.data.fill > 80 ? '수거 예정' : '정상'
        });
      } catch (error) {
        console.error('데이터 처리 중 에러:', error);
      }
    });

    // 연결 해제 시 정리
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 🔹 각 층마다 우선순위 높은 쓰레기통 1개만 반환
  const getPriorityBinPerFloor = () => {
    const floorMap: Record<string, typeof bins[0]> = {};

    bins.forEach((bin) => {
      const existing = floorMap[bin.floor];

      if (!existing) {
        floorMap[bin.floor] = bin;
      } else {
        // 🔥 화재가 우선
        const existingIsFire = existing.isFireDetected;
        const currentIsFire = bin.isFireDetected;

        if (currentIsFire && !existingIsFire) {
          floorMap[bin.floor] = bin;
        } else if (currentIsFire === existingIsFire) {
          if (bin.fillLevel > existing.fillLevel) {
            floorMap[bin.floor] = bin;
          }
        }
      }
    });

    return Object.entries(floorMap).map(([floor, bin]) => ({ floor, bin }));
  };

  const getIcon = (bin: typeof bins[0]) => {
    if (bin.isFireDetected) return 'fire';
    if (bin.status === '수거 예정') return 'truck';
    return 'trash';
  };

  const getColor = (bin: typeof bins[0]) => {
    if (bin.isFireDetected) return 'red';
    if (bin.status === '수거 예정') return 'orange';
    if (bin.fillLevel >= 80) return 'red';
    if (bin.fillLevel >= 60) return 'yellow';
    if (bin.fillLevel >= 40) return 'blue';
    return 'green';
  };

  return (
    <View style={styles.container}>
      <AlertContainer />
      <Text style={styles.title}>해양공학관</Text>
      <FlatList
        data={getPriorityBinPerFloor()}
        keyExtractor={(item) => item.floor}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Floor', { floor: item.floor })}
          >
            <Text style={styles.floorText}>{item.floor}</Text>
            <Icon name={getIcon(item.bin)} size={24} color={getColor(item.bin)} style={styles.icon} />
            <Text style={styles.fillText}>{item.bin.fillLevel}%</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  floorText: { flex: 1, fontSize: 18 },
  icon: { marginHorizontal: 12 },
  fillText: { fontSize: 16, fontWeight: 'bold' },
});

