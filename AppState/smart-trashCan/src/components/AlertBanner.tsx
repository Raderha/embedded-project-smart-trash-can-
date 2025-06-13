// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// interface AlertBannerProps {
//   message: string;
// }

// export default function AlertBanner({ message }: AlertBannerProps) {
//   return (
//     <View style={styles.banner}>
//       <Text style={styles.bannerText}>{message}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   banner: {
//     backgroundColor: '#ff5555',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginBottom: 15,
//     alignSelf: 'stretch',
//   },
//   bannerText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrashBinContext } from '../context/TrashBinContext';

export default function AlertBanner() {
  const { bins } = useContext(TrashBinContext);

  const fireBins = bins.filter((bin) => bin.isFireDetected);
  const fullBins = bins.filter((bin) => !bin.isFireDetected && bin.fillLevel >= 80);

  const shouldShow = fireBins.length > 0 || fullBins.length > 0;
  if (!shouldShow) return null;

  return (
    <View style={styles.container}>
      {fireBins.map((bin) => (
        <Text key={bin.id} style={styles.alertText}>
          🚨 {bin.floor}층 {bin.location}: 화재 감지!
        </Text>
      ))}
      {fullBins.map((bin) => (
        <Text key={bin.id} style={styles.alertText}>
          ⚠️ {bin.floor}층 {bin.location}: 쓰레기 가득 참!
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderBottomColor: '#ffeeba',
    borderBottomWidth: 1,
  },
  alertText: {
    color: '#856404',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
