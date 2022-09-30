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
import RequireAuth from "./infrastructure/RequireAuth";
import RequireInstructor from "./infrastructure/RequireInstructor";
import AppHeader from './AppHeader';
import SplashLoading from './SplashLoading';
import SignIn from './SignIn';
import Skeleton from './util/Skeleton';

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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={SplashLoading} />
      </Stack.Navigator>
    </NavigationContainer>

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
