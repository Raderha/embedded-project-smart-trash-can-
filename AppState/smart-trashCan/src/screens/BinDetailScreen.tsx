import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { TrashBinContext } from '../context/TrashBinContext';
import { TrashBinStatus } from '../types/TrashBin';

export default function BinDetail({ route, navigation }: any) {
  const { bin } = route.params;
  const { updateBin } = useContext(TrashBinContext);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === '수거 예정') {
      Alert.prompt(
        '담당자 입력',
        '수거를 담당할 사람의 이름을 입력하세요.',
        (name) => {
          const updatedBin: TrashBinStatus = { ...bin, status: newStatus, assignedUser: name };
          updateBin(updatedBin);
          navigation.goBack();
        }
      );
    } else {
      const updatedBin: TrashBinStatus = {
        ...bin,
        status: newStatus,
        assignedUser: newStatus === '정상' ? null : bin.assignedUser,
        // isFireDetected: newStatus === '상황 종료' ? false : bin.isFireDetected,
      };
      updateBin(updatedBin);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>상세 정보</Text>
      <Text>층: {bin.floor}</Text>
      <Text>위치: {bin.location}</Text>
      <Text>잔량: {bin.fillLevel}%</Text>
      <Text>상태: {bin.status}</Text>
      <Text>화재 발생 여부: {bin.isFireDetected ? '🔥 예' : '아니오'}</Text>
      <Text>담당자: {bin.assignedUser ?? '없음'}</Text>

      <View style={styles.buttonContainer}>
        <Button title="수거 예약" onPress={() => handleStatusChange('수거 예정')} />
        <Button title="수거 완료" onPress={() => handleStatusChange('정상')} />
        {/* <Button title="상황 종료" onPress={() => handleStatusChange('상황 종료')} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
});
