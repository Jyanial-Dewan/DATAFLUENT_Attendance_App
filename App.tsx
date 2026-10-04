import React from 'react';
import {AuthProvider} from './src/context/AuthContext';
import AppNavigator from './src/navigations/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
