import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import {getContext, setInitialised} from './ContextSlice';
import {cleanUpMsgs} from './StatusSlice';
import { useTypedSelector } from "./AppReducers";
import SplashLoading from "../SplashLoading";

type Props = {
  children?: React.ReactNode,
  host: string,
  endpointsUrl: string,
};

export default function AppInit(props: Props ) {
  const dispatch = useDispatch( );

  const initialised = useTypedSelector( (state) => state.context.status.initialised );
  const isLoggedIn = useTypedSelector( (state) => state.context.status.loggedIn );
  const endpointsLoaded = useTypedSelector( (state) => state.context.status.endpointsLoaded );

  const endpoints = useTypedSelector( (state) => state.context.endpoints );

  useEffect( ()=> {
    //dispatch( authConfig()  )
    dispatch( getContext(
      {
        host: props.host,
        endPointsUrl: props.endpointsUrl
      } ) );
    setInterval(function(){ 
      //this code runs every minute 
      dispatch( cleanUpMsgs( ) );
    }, 6000);
    
  }, [] )

  //return props.children;
}

AppInit.propTypes = {};
