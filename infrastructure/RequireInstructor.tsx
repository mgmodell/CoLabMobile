import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTypedSelector } from './AppReducers';

export default function RequireInstructor({ children }) {
  const isLoggedIn = useTypedSelector( (state)=>state.context.status.loggedIn );
  const isLoggingIn = useTypedSelector( (state)=>state.context.status.loggingIn );
  const user = useTypedSelector(state => state.profile.user);

  const location = useLocation( );

  if( user.is_instructor || user.is_admin ) {

    return children;

  } else if( isLoggingIn ) {
    return <h1>Suspenseful</h1>;

  } else {
    return <Navigate to='/'
                    replace
           />;

  }

}
