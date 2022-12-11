import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";

import { Text, Provider } from "react-native-paper";
import {View} from 'react-native'

import SplashLoading from "./SplashLoading";
import SignIn from "./SignIn";


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTranslation } from "react-i18next";
import { useTypedSelector } from "./infrastructure/AppReducers";
import NavMenu from "./NavMenu";

export default function NavShell(props) {
  const { t, i18n } = useTranslation();

  const isLoggedIn = useTypedSelector(state => state.context.status.loggedIn);
  const loggingIn = useTypedSelector(state => state.context.status.loggingIn);

  const Stack = createNativeStackNavigator();

  const endpointsLoaded = useTypedSelector(
    state => state.context.status.endpointsLoaded
  );

  let mainStack = (<Stack.Screen name='Splash' component={SplashLoading}/>);

  // Update this.
  const LoggedInMessage = ({ route, navigation })=>{
    const {title, text} = route.params;
    return(
      <View>
        <Text variant='displayLarge'>{title}</Text>
        <Text variant='displaySmall'>{text}</Text>
      </View>
    );
  }



  if( isLoggedIn ){

    mainStack = (<Stack.Screen
                  name='Logged In'
                  // Dennis import your screen and replace 'LoggedInMessage' here with yours.
                  component={LoggedInMessage}
                  initialParams={
                    {
                      title: 'Logged In',
                      text: 'I love you!'
                    }
                  }
                  options={({navigationBarColor, route }) =>({
                    headerTitle: 'CoLab',
                    headerRight: () => (
                      <NavMenu />
                    )
                  })}
                  />);


  } else if( !loggingIn ){
    mainStack = (<Stack.Screen name='Log In' component={SignIn} />);

  };


  return (
    <Provider>

    <NavigationContainer>
      <Stack.Navigator>
        { mainStack }
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

NavShell.propTypes = {

};
