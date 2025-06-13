import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import FloorScreen from './src/screens/FloorScreen';
import BinDetail from './src/screens/BinDetail';
import { TrashBinProvider } from './src/context/TrashBinContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TrashBinProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Floor" component={FloorScreen} /> 
          <Stack.Screen name="BinDetail" component={BinDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </TrashBinProvider>
  );
}