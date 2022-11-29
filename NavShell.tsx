import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";

import { Text } from "react-native-paper";

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


  let mainStack = (<Stack.Screen name='Splash' component={SplashLoading}/>);

  // Dennis, replace this with your component
  const LoggedInMessage = ()=>{
    return(

      <Text variant='displayLarge'>I love you!</Text>
    );
  }


  if( isLoggedIn ){

    mainStack = (<Stack.Screen name='Log In' component={LoggedInMessage} />);


  } else if( !loggingIn ){
    mainStack = (<Stack.Screen name='Log In' component={SignIn} />);

  };


  return (
    <NavigationContainer>
      <Stack.Navigator>
        { mainStack }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

NavShell.propTypes = {

};
