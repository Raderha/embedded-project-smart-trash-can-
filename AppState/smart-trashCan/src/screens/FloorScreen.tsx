import React, { useContext } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { TrashBinContext } from '../context/TrashBinContext';

export default function FloorScreen({ route, navigation }: any) {
  const { floor } = route.params;
  const { bins } = useContext(TrashBinContext);

  // 층 필터링 + 정렬 (1. 화재 → 2. 잔량)
  const sorted = [...bins]
    .filter((b) => b.floor === floor)
    .sort((a, b) => {
      if (a.isFireDetected !== b.isFireDetected) return b.isFireDetected ? 1 : -1;
      return b.fillLevel - a.fillLevel;
    });

  const getStatusColor = (bin: any) => {
    if (bin.isFireDetected) return 'red';
    if (bin.fillLevel >= 80) return 'orange';
    return 'black';
  };

  const getStatusText = (bin: any) => {
    if (bin.isFireDetected) return '🔥 화재 발생';
    if (bin.fillLevel >= 80) return '⚠ 가득 참';
    return bin.status || '정상';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{floor}층 쓰레기통</Text>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => navigation.navigate('BinDetail', { binId: item.id })}
          >
            <Text style={[styles.binText, { color: getStatusColor(item) }]}>
              📍 {item.location} - {item.fillLevel}% ({getStatusText(item)})
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: {
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  binText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// // import React, { useContext } from 'react';
// // import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// // import { TrashBinContext } from '../context/TrashBinContext';
// // import Icon from 'react-native-vector-icons/FontAwesome';
// // import AlertContainer from '../components/AlertContainer';

// // export default function FloorScreen({ route, navigation }: any) {
// //   const { floor } = route.params;
// //   const { bins } = useContext(TrashBinContext);

// //   const floorBins = bins.filter((bin) => bin.floor === floor);

// //   const getIcon = (bin: typeof bins[0]) => {
// //     if (bin.isFireDetected) return 'fire';
// //     if (bin.status === '수거 예정') return 'truck';
// //     return 'trash';
// //   };

// //   const getColor = (bin: typeof bins[0]) => {
// //     if (bin.isFireDetected) return 'red';
// //     if (bin.status === '수거 예정') return 'orange';
// //     if (bin.fillLevel >= 80) return 'red';
// //     if (bin.fillLevel >= 60) return 'yellow';
// //     if (bin.fillLevel >= 40) return 'blue';
// //     return 'green';
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <AlertContainer />
// //       <Text style={styles.title}>{floor} 쓰레기통</Text>
// //       <FlatList
// //         data={floorBins}
// //         keyExtractor={(item) => item.id}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={styles.itemContainer}
// //             onPress={() => navigation.navigate('BinDetail', { binId: item.id })}>
// //             <Text style={styles.locationText}>{item.location}</Text>
// //             <Icon name={getIcon(item)} size={24} color={getColor(item)} style={styles.icon} />
// //             <Text style={styles.fillText}>{item.fillLevel}%</Text>
// //           </TouchableOpacity>
// //         )}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20 },
// //   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
// //   itemContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderColor: '#ccc',
// //   },
// //   locationText: { flex: 1, fontSize: 16 },
// //   icon: { marginHorizontal: 12 },
// //   fillText: { fontSize: 16, fontWeight: 'bold' },
// // });
// import React, { useContext } from 'react';
// import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
// import { TrashBinContext } from '../context/TrashBinContext';

// export default function FloorScreen({ route, navigation }: any) {
//   const { floor } = route.params;
//   const { bins } = useContext(TrashBinContext);

//   const filtered = bins.filter((b) => b.floor === floor);
//   const sorted = [...filtered].sort((a, b) => {
//     if (a.isFireDetected !== b.isFireDetected) return b.isFireDetected ? 1 : -1;
//     return b.fillLevel - a.fillLevel;
//   });

//   const getStatusColor = (bin: any) => {
//     if (bin.isFireDetected) return 'red';
//     if (bin.fillLevel >= 80) return 'orange';
//     return 'black';
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{floor}층 쓰레기통</Text>
//       <FlatList
//         data={sorted}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <Pressable
//             style={styles.item}
//             onPress={() => navigation.navigate('BinDetail', { binId: item.id })}
//           >
//             <Text style={{ color: getStatusColor(item), fontWeight: 'bold' }}>
//               {item.location} - {item.fillLevel}% ({item.status})
//             </Text>
//           </Pressable>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
//   item: {
//     paddingVertical: 10,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
// });
