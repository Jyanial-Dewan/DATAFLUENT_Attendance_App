import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({}: HomeScreenProps) => {
  const {user, signOut} = useAuth();

  return (
    <View style={styles.container}>
      <Text>Welcome, {user?.name}!</Text>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('Attendance', {type: 'check-in'})}>
        <Text>Check In</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={signOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default HomeScreen;
