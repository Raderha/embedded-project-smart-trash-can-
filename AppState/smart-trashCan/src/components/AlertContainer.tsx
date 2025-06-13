import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrashBinContext } from '../context/TrashBinContext';

export default function AlertContainer() {
  const { bins } = useContext(TrashBinContext);
  const fireBins = bins.filter((bin) => bin.isFireDetected);

  if (fireBins.length === 0) return null;

  return (
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>🔥 화재 감지된 쓰레기통:</Text>
      {fireBins.map((bin) => (
        <Text key={bin.id} style={styles.alertText}>
          • {bin.floor} - {bin.location}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    backgroundColor: '#ffe5e5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 6,
  },
  alertText: {
    color: '#222',
    fontSize: 14,
  },
});
