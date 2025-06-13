// import React, { useContext, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Button,
//   Alert,
//   Modal,
//   TouchableOpacity,
// } from 'react-native';
// import { TrashBinContext } from '../context/TrashBinContext';
// import { TrashBinStatus } from '../types/TrashBin';

// const ASSIGNEES = ['고관우', '박성하', '이재서', '엄예준'];

// export default function BinDetail({ route, navigation }: any) {
//   const { binId } = route.params || {};
//   const { bins, updateBin } = useContext(TrashBinContext);
//   const bin = bins.find((b) => b.id === binId);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState<string | null>(null); // ← 어떤 상태 변화인지 기억

//   if (!bin) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>잘못된 접근입니다.</Text>
//         <Button title="홈으로" onPress={() => navigation.navigate('Home')} />
//       </View>
//     );
//   }

//   const getStatusText = () => {
//     if (bin.isFireDetected) return '🔥 화재 발생';
//     if (bin.fillLevel >= 80) return '쓰레기통 가득 참!';
//     return bin.status;
//   };

//   const isAlert = bin.isFireDetected || bin.fillLevel >= 80;

//   const handleStatusChange = (newStatus: string) => {
//   if (newStatus === '수거 예정') {
//     setPendingStatus(newStatus);
//     setModalVisible(true); // 수거 예정은 항상 모달 열기
//   } else if (newStatus === '정상') {
//     // 🔥 화재 상태에서는 수거 완료 불가
//     if (bin.isFireDetected) {
//       Alert.alert('⚠️ 경고', '화재 상태입니다. 먼저 상황을 종료 해주세요!');
//       return;
//     }

//     if (!bin.assignedUser) {
//       Alert.alert('⚠️ 경고', '담당자를 선택해주세요!');
//       return;
//     }

//  const updatedBin: TrashBinStatus = {
//       ...bin,
//       status: '정상',
//       fillLevel: 0,
//       lastCollectedAt: new Date().toISOString(),
//     };
//     updateBin(updatedBin);
//     Alert.alert('✅ 수거 완료', `잔량이 0%로 초기화되었습니다. (${bin.assignedUser})`);
//   } else if (newStatus === '상황 종료') {
//     if (!bin.assignedUser) {
//       Alert.alert('⚠️ 경고', '담당자를 선택해주세요!');
//       return;
//     }
//     const updatedBin: TrashBinStatus = {
//       ...bin,
//       isFireDetected: false,
//       status: '정상',
//       fillLevel: 0,
//       lastCollectedAt: new Date().toISOString(),
//     };
//     updateBin(updatedBin);
//     Alert.alert('✅ 상황 종료', `화재 및 잔량 상태 초기화 완료. (${bin.assignedUser})`);
//   }
// };



//   const handleAssigneeSelect = (name: string) => {
//     const now = new Date().toISOString();
//     let updatedBin: TrashBinStatus;

//     if (pendingStatus === '수거 예정') {
//       updatedBin = {
//         ...bin,
//         status: '수거 예정',
//         assignedUser: name,
//       };
//       Alert.alert('✅ 수거 예약', `${name} 담당자로 설정되었습니다.`);
//     } else if (pendingStatus === '정상') {
//       updatedBin = {
//         ...bin,
//         status: '정상',
//         fillLevel: 0,
//         assignedUser: name,
//         lastCollectedAt: now,
//       };
//       Alert.alert('✅ 수거 완료', `잔량이 0%로 초기화되었습니다. (${name})`);
//     } else if (pendingStatus === '상황 종료') {
//       updatedBin = {
//         ...bin,
//         isFireDetected: false,
//         status: '정상',
//         fillLevel: 0,
//         assignedUser: name,
//         lastCollectedAt: now,
//       };
//       Alert.alert('✅ 상황 종료', `화재 및 잔량 상태 초기화 완료. (${name})`);
//     } else {
//       return;
//     }

//     updateBin(updatedBin);
//     setModalVisible(false);
//     setPendingStatus(null);
//   };

//   return (
//     <View style={[styles.container, isAlert && styles.alertContainer]}>
//       <Text style={styles.title}>상세 정보</Text>
//       <Text>층: {bin.floor}</Text>
//       <Text>위치: {bin.location}</Text>
//       <Text>잔량: {bin.fillLevel}%</Text>
//       <Text>상태: {getStatusText()}</Text>
//       <Text>화재 발생 여부: {bin.isFireDetected ? '🔥 예' : '아니오'}</Text>
//       <Text>담당자: {bin.assignedUser ?? '없음'}</Text>
//       {bin.lastCollectedAt && (
//         <Text>
//           최근 수거 시각: {new Date(bin.lastCollectedAt).toLocaleString()} ({bin.assignedUser})
//         </Text>
//       )}

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={[styles.button, styles.reserve]} onPress={() => handleStatusChange('수거 예정')}>
//             <Text style={styles.buttonText}>📦 수거 예약</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button, styles.complete]} onPress={() => handleStatusChange('정상')}>
//             <Text style={styles.buttonText}>✅ 수거 완료</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button, styles.resolve]} onPress={() => handleStatusChange('상황 종료')}>
//             <Text style={styles.buttonText}>🚨 상황 종료</Text>
//         </TouchableOpacity>
//       </View>


//       {/* 담당자 선택 모달 */}
//       <Modal transparent visible={modalVisible} animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>담당자 선택</Text>
//             {ASSIGNEES.map((name) => (
//               <TouchableOpacity key={name} onPress={() => handleAssigneeSelect(name)}>
//                 <Text style={styles.modalOption}>{name}</Text>
//               </TouchableOpacity>
//             ))}
//             <Button title="취소" onPress={() => setModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   alertContainer: { backgroundColor: '#ffe5e5' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   buttonContainer: { marginTop: 20, gap: 12 },
//   errorText: { fontSize: 18, color: 'red', marginBottom: 20 },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#00000099',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '70%',
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     gap: 10,
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   modalOption: { fontSize: 16, paddingVertical: 8 },
//   buttonContainer: {
//   marginTop: 30,
//   gap: 12,
// },

// button: {
//   paddingVertical: 14,
//   borderRadius: 10,
//   alignItems: 'center',
// },

// buttonText: {
//   color: 'white',
//   fontSize: 16,
//   fontWeight: 'bold',
// },

// reserve: {
//   backgroundColor: '#4a90e2', // 파란색
// },

// complete: {
//   backgroundColor: '#50c878', // 초록색
// },

// resolve: {
//   backgroundColor: '#e94e4e', // 빨간색
// },

// });
import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, Modal, TouchableOpacity, Pressable,
} from 'react-native';
import { TrashBinContext } from '../context/TrashBinContext';
import { TrashBinStatus } from '../types/TrashBin';

const ASSIGNEES = ['고관우', '박성하', '이재서', '엄예준'];

export default function BinDetail({ route, navigation }: any) {
  const { binId } = route.params || {};
  const { bins, updateBin } = useContext(TrashBinContext);
  const bin = bins.find((b) => b.id === binId);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  if (!bin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>잘못된 접근입니다.</Text>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.btnText}>홈으로</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusText = () => {
    if (bin.isFireDetected) return '🔥 화재 발생';
    if (bin.fillLevel >= 80) return '쓰레기통 가득 참!';
    return bin.status;
  };

  const isAlert = bin.isFireDetected || bin.fillLevel >= 80;

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === '정상' && !bin.assignedUser) {
      Alert.alert('⚠️ 오류', '수거 예약 없이 수거 완료할 수 없습니다.');
      return;
    }
    if (newStatus === '수거 예정' || newStatus === '상황 종료') {
      setPendingStatus(newStatus);
      setModalVisible(true);
    } else if (newStatus === '정상') {
      const now = new Date().toISOString();
      const updatedBin: TrashBinStatus = {
        ...bin,
        // status: '정상',
        // fillLevel: 0,
        lastCollectedAt: now,
      };
      updateBin(updatedBin);
      Alert.alert('✅ 수거 완료', `정상적으로 수거 되었습니다.`);
    }
  };

  const handleAssigneeSelect = (name: string) => {
    const now = new Date().toISOString();
    let updatedBin: TrashBinStatus;

    if (pendingStatus === '수거 예정') {
      updatedBin = {
        ...bin,
        status: '수거 예정',
        assignedUser: name,
      };
      Alert.alert('✅ 수거 예약', `${name} 담당자로 설정되었습니다.`);
    } else if (pendingStatus === '상황 종료') {
      updatedBin = {
        ...bin,
        isFireDetected: false,
        status: '정상',
        fillLevel: 0,
        assignedUser: name,
        lastCollectedAt: now,
      };
      Alert.alert('✅ 상황 종료', `화재 및 잔량 상태 초기화 완료. (${name})`);
    } else {
      return;
    }

    updateBin(updatedBin);
    setModalVisible(false);
    setPendingStatus(null);
  };

  return (
    <View style={[styles.container, isAlert && styles.alertContainer]}>
      <Text style={styles.title}>상세 정보</Text>
      <Text>층: {bin.floor}</Text>
      <Text>위치: {bin.location}</Text>
      <Text>잔량: {bin.fillLevel}%</Text>
      <Text>상태: {getStatusText()}</Text>
      <Text>화재 발생 여부: {bin.isFireDetected ? '🔥 예' : '아니오'}</Text>
      <Text>담당자: {bin.assignedUser ?? '없음'}</Text>
      {bin.lastCollectedAt && (
        <Text>
          최근 수거 시각: {new Date(bin.lastCollectedAt).toLocaleString()} ({bin.assignedUser})
        </Text>
      )}

      <View style={styles.buttonRow}>
        <Pressable style={styles.btn} onPress={() => handleStatusChange('수거 예정')}>
          <Text style={styles.btnText}>수거 예약</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => handleStatusChange('정상')}>
          <Text style={styles.btnText}>수거 완료</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => handleStatusChange('상황 종료')}>
          <Text style={styles.btnText}>상황 종료</Text>
        </Pressable>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>담당자 선택</Text>
            {ASSIGNEES.map((name) => (
              <TouchableOpacity key={name} onPress={() => handleAssigneeSelect(name)}>
                <Text style={styles.modalOption}>{name}</Text>
              </TouchableOpacity>
            ))}
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'gray', marginTop: 10, textAlign: 'center' }}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  alertContainer: { backgroundColor: '#fff0f0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  errorText: { fontSize: 18, color: 'red' },
  buttonRow: { marginTop: 30, gap: 14 },
  btn: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  modalOverlay: {
    flex: 1, backgroundColor: '#00000077', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: '70%', backgroundColor: 'white', padding: 20, borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalOption: {
    fontSize: 16, paddingVertical: 8, textAlign: 'center',
  },
});
