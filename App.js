/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { startTransition, Suspense } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
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

import { Provider } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


 import { SafeAreaProvider } from 'react-native-safe-area-context';


import { configureStore } from "@reduxjs/toolkit";
import appStatus from "./infrastructure/AppReducers";
import AppInit from './infrastructure/AppInit';
import NavShell from './NavShell';

const Stack = createNativeStackNavigator();


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const getEndpointsUrl = 'http://localhost:3000/infra/endpoints';

  const store = configureStore({
    reducer: appStatus
  })


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaProvider>

      <Provider store={store}>
        <AppInit endpointsUrl={getEndpointsUrl}>
          <NavShell />
        </AppInit>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
