import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types/navigation';

import HomeScreen from './screens/HomeScreen';
import FloorScreen from './screens/FloorScreen';
import BinDetailScreen from './screens/BinDetailScreen';


const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Floor" component={FloorScreen} />
        <Stack.Screen name="BinDetail" component={BinDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
