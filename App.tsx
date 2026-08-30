/**
 * CoLab Mobile App
 *
 * @format
 */

import React from 'react';
import { HOST, ENDPOINTS_URL } from './config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import appStatus from './infrastructure/AppReducers';
import AppInit from './infrastructure/AppInit';
import NavShell from './NavShell';

const App = () => {
  //const isDarkMode = useColorScheme() === 'dark';

  const store = configureStore({
    reducer: appStatus
  })


  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppInit
          host={HOST}
          endpointsUrl={ENDPOINTS_URL} />
            
          <NavShell />
      </Provider>
    </SafeAreaProvider>

  );
};


export default App;
