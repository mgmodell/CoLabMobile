import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";

import { 
  View,
} from 'react-native';

import {
  Text,
} from 'react-native-paper';

import Logo from "./Logo";
import Quote from "./Quote";

import { useTranslation } from "react-i18next";
import { useTypedSelector } from "./infrastructure/AppReducers";

export default function SplashLoading(props) {
  const { t, i18n } = useTranslation();
  const endpointSet = "home";
  const endpoints = useTypedSelector(
    state => state.context.endpoints[endpointSet]
  );
  const endpointsLoaded = useTypedSelector(
    state => state.context.status.endpointsLoaded
  );

  console.log( 'epv', endpointsLoaded, endpoints );
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Logo />
          <Text variant='bodyLarge'>CoLab</Text>
    </View>
    /*
    <Header
      leftComponent={<MainMenu
                diversityScoreFor={endpoints.diversityScoreFor}
                reportingUrl={endpoints.reportingUrl}
                supportAddress={endpoints.supportAddress}
                moreInfoUrl={endpoints.moreInfoUrl}
                />}
      centerComponent={
        <React.Fragment>
          <Logo />
          <Text>CoLab</Text>
          <Quote url={endpoints.quotePath} />
        </React.Fragment>
      }
      rightComponent={<HelpMenu />}
      />
      */
  );
}

SplashLoading.propTypes = {

};
