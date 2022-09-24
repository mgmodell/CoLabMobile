import React from 'react';
import { Navigate, useLocation } from 'react-router-native';
import { useTypedSelector } from './AppReducers';
import Skeleton from '../util/Skeleton';

export default function RequireInstructor({ children }) {
  const isLoggedIn = useTypedSelector( (state)=>state.context.status.loggedIn );
  const isLoggingIn = useTypedSelector( (state)=>state.context.status.loggingIn );
  const user = useTypedSelector(state => state.profile.user);

  const location = useLocation( );

  if( user.is_instructor || user.is_admin ) {

    return children;

  } else if( isLoggingIn ) {
    return <Skeleton height={300} />

  } else {
    return <Navigate to='/'
                    replace
           />;

  }

}
