import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useAuth} from '../context/AuthContext';

const LoginScreen = () => {
  const {signIn} = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance App</Text>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 40},
  button: {backgroundColor: '#4285F4', padding: 16, borderRadius: 8},
  buttonText: {color: 'white', fontSize: 16, fontWeight: '600'},
});

export default LoginScreen;
