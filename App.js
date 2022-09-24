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
import { 
  NativeRouter as Router,
  Routes,
  Route,
  useParams
 } from "react-router-native";
 import { SafeAreaProvider } from 'react-native-safe-area-context';


import { configureStore } from "@reduxjs/toolkit";
import appStatus from "./infrastructure/AppReducers";
import AppInit from './infrastructure/AppInit';
import RequireAuth from "./infrastructure/RequireAuth";
import RequireInstructor from "./infrastructure/RequireInstructor";
import AppHeader from './AppHeader';
import SignIn from './SignIn';
import Skeleton from './util/Skeleton';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

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
      <AppHeader />
      <AppInit endpointsUrl={getEndpointsUrl}>
    <SafeAreaView style={backgroundStyle}>
      <AppHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
        </View>
        <Router>
          <Routes>

          <Route
                    path="/"
                    element={
                      <RequireAuth>
                        <h1>Dennis will build this</h1>
                      </RequireAuth>
                    }
                  />
          <Route path="login"
          element={
            <Suspense fallback={<Skeleton /> } >
              <SignIn />
            </Suspense>
            /*
            startTransition(()=>{
              return(<SignIn />)
            })
            */
          } />
          </Routes>
        </Router>
      </ScrollView>
    </SafeAreaView>
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
