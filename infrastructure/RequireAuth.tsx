import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTypedSelector } from './AppReducers';

export default function RequireAuth({ children }) {
  const isLoggedIn = useTypedSelector( (state)=>state.context.status.loggedIn );
  const isLoggingIn = useTypedSelector( (state)=>state.context.status.loggingIn );
  const location = useLocation( );

  if( isLoggedIn ) {

    return children;

  } else if( isLoggingIn ) {
    return <h1>Suspenseful</h1>;

  } else {
    return <Navigate to='/login'
                    replace
                    state={{ from: location.pathname}}
           />;

  }

}
