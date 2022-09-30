import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";

import SplashLoading from "./SplashLoading";
import SignIn from "./SignIn";


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTranslation } from "react-i18next";
import { useTypedSelector } from "./infrastructure/AppReducers";

export default function NavShell(props) {
  const { t, i18n } = useTranslation();

  const isLoggedIn = useTypedSelector(state => state.context.status.loggedIn);
  const loggingIn = useTypedSelector(state => state.context.status.loggingIn);

  const Stack = createNativeStackNavigator();

  const endpointsLoaded = useTypedSelector(
    state => state.context.status.endpointsLoaded
  );

  console.log( 'logging in:', loggingIn );
  return (
    <NavigationContainer>
      <Stack.Navigator>
      {
        loggingIn ? (
          <Stack.Screen name="Home" component={SplashLoading} />

        ) : (
          <Stack.Screen name="Home" component={SignIn} />

        )

      }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

NavShell.propTypes = {

};
