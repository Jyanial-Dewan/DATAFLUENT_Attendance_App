import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from './types';
import {useAuth} from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
// import AttendanceScreen from '../screens/AttendanceScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return null; // Or a splash/loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          // Authenticated routes
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* <Stack.Screen name="Attendance" component={AttendanceScreen} /> */}
          </>
        ) : (
          // Unauthenticated routes
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
