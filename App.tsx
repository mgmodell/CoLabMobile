/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOST, ENDPOINTS_URL } from './config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import appStatus from './infrastructure/AppReducers';
import AppInit from './infrastructure/AppInit';
import NavShell from './NavShell';


import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

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
