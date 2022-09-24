import React, { useState, useEffect, Suspense } from "react";
import PropTypes from "prop-types";

import { Header, Text } from "@rneui/themed";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Skeleton from "./util/Skeleton";

import Logo from "./Logo";
import MainMenu from "./MainMenu";
import HelpMenu from "./HelpMenu"
import Quote from "./Quote";

import { i18n } from "./infrastructure/i18n";
import { useTranslation } from "react-i18next";
import { useTypedSelector } from "./infrastructure/AppReducers";

export default function AppHeader(props) {
  const { t, i18n } = useTranslation();
  const endpointSet = "home";
  const endpoints = useTypedSelector(
    state => state.context.endpoints[endpointSet]
  );
  const endpointsLoaded = useTypedSelector(
    state => state.context.status.endpointsLoaded
  );

  return (
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
  );
}

AppHeader.propTypes = {};
