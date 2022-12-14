/*
 * This code was largely adapted from j-toker.
 * https://github.com/lynndylanhurley/j-toker
 */
import axios from 'axios';

import {fetchProfile, setProfile, clearProfile} from './ProfileSlice';
import {addMessage, Priorities} from './StatusSlice';
import i18n from './i18n';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';

const category = 'devise';
const t = i18n.getFixedT( null, category );

const CONFIG = {
    SAVED_CREDS_KEY:    'colab_authHeaders',
    API_URL:            '/auth',
    SIGN_OUT_PATH:      '/auth/sign_out',
    EMAIL_SIGNIN_PATH:  '/auth/sign_in',
    EMAIL_REGISTRATION_PATH: '/auth',

    tokenFormat: {
        "access-token": "{{ access-token }}",
        "token-type":   "Bearer",
        client:         "{{ client }}",
        expiry:         "{{ expiry }}",
        uid:            "{{ uid }}"
    },

    parseExpiry: function(headers){
        // convert from ruby time (seconds) to js time (millis)
        return (parseInt(headers['expiry'], 10) * 1000) || null;
    },

    /**
     * This function is used as an axios send interceptor.
     * 
     * @param config what has already been configured to be sent.
     * @returns 
     */
    appendAuthHeaders: async function( config: any ){
        const storedHeaders = await CONFIG.retrieveData( CONFIG.SAVED_CREDS_KEY );

        if ( CONFIG.isApiRequest(config.url) && storedHeaders) {
            // bust IE cache
          config['headers'][ 'If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

          // set header for each key in `tokenFormat` config
          for (var key in CONFIG.tokenFormat) {
            config['headers'][key] =  storedHeaders[key];
          }
        }
        return config;

    },

    /**
     * This function is used as an axios receive interceptor.
     * 
     * @param response 
     * @returns 
     */
    storeRetrievedCredentials: function( response: any ){

        if( CONFIG.isApiRequest( response['config']['url'] ) ){
            let newHeaders = {};
            let blankHeaders = true;

            for( var key in CONFIG.tokenFormat){
                newHeaders[ key ] = response['headers'][key];
                if( undefined !== newHeaders[key]){
                    blankHeaders = false;
                }
            }


            if( !blankHeaders ) {
                CONFIG.persistData( CONFIG.SAVED_CREDS_KEY, newHeaders );
            }


        };
        return response;
    },

    isApiRequest: function( url: string ){
        //Maybe we'll do something meaningful here later
        return true;
    },

    //Layer of indirection to support AsyncStorage - probably unnecessary
    async retrieveData( key ){
        const val = await getData( key );

        // if value is a simple string, the parser will fail. in that case, simply
        // unescape the quotes and return the string.
        try {
          // return parsed json response
          return JSON.parse( val );
        } catch (err) {
          // unescape quotes
          return val ; // && val.replace(/("|')/g, '');
        }

    },

    persistData: function( key : string, val ){
        let data = JSON.stringify( val );
        storeData( key, data );

    },

    deleteData: function( key : string ){
        removeData( key );
    },


    retrieveResources: function( dispatch: Function, getState: Function ){
        const endPointsUrl = getState()['context']['config']['endpoint_url'];

        return axios.get( endPointsUrl + '.json',
            { withCredentials: true } )
            .then( resp =>{
                if( resp['data'][ 'logged_in'] ){
                    dispatch( setLoggedIn(
                        resp['data']['lookups'],
                        resp['data']['endpoints'] ) );
                    dispatch( setProfile( resp['data']['profile']['user']) )
                    //dispatch( fetchProfile( ) );
                } else {
                    dispatch( setLoggedOut( ) );
                    dispatch( setLookups( resp['data']['lookups'] ) );
                    dispatch( setEndPoints( resp['data']['endpoints'] ) );
                    dispatch( clearProfile );
                    CONFIG.deleteData( CONFIG.SAVED_CREDS_KEY );
                }

            })
            .catch( (e) =>{
                console.log( e );
            })

    },


}

const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      
    } catch (e) {
      // saving error
        console.log( 'error saving', e );
    }
  }

const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if(value !== null) {
        return value;
        // value previously stored
      }
    } catch(e) {
      // error reading value
        console.log( 'error reading', e );
    }
}

const removeData = async (key: string) =>{
    try {
        await AsyncStorage.removeItem( key );
    } catch(e) {
        // remove error
        console.log( 'error removing', e );
    }
}
  
export interface ContextRootState {
    status: {
        initialised: boolean;
        loggingIn: boolean;
        loggedIn: boolean;
        endpointsLoaded: boolean;
        lookupsLoaded: boolean;
    };
    config: {
        localStorage?: boolean;
        host?: string;
        endpoint_url?: string;
    };
    lookups: { 
        [key: string]: {
            [key: string]: Object;
        };
    };
    endpoints: { 
        [key: string]: {
            [key: string]: string;
        };
    };
}

const initialState : ContextRootState = {
    status: {
        initialised: false,
        loggingIn: false,
        loggedIn: false,
        endpointsLoaded: false,
        lookupsLoaded: false,
    },
    config: {
        localStorage: null,
        host: null,
        endpoint_url: null,
    },
    lookups: {
        behaviors: { },
        countries: { },
        languages: { },
        cip_codes: { },
        genders: { },
        themes: { },
        timezones: { },
        schools: { },
     },
    endpoints: { },
}


const contextSlice = createSlice({
    name: 'context',
    initialState: initialState,
    reducers: {
        setInitialised: {
            reducer: (state, action) => {
                state.status.initialised = true;
            }
        },
        setEndPointUrl: {
            reducer: (state, action ) => {
                state.config.host = action.payload.host;
                state.config.endpoint_url = action.payload.host + action.payload.endPointUrl;
            },
            prepare: (host: string, endPointUrl: string ) => {
                return{
                    payload:{
                        host: host,
                        endPointUrl: endPointUrl
                    }
                }
            }
        },
        setLoggingIn: {
            reducer: (state, action ) => {
                state.status.loggingIn = true;
                state.status.loggedIn = false;
            }
        },
        setLoggedIn: {
            reducer: (state, action ) =>{

                state.status.loggingIn = false;
                state.status.loggedIn = true;
                state.lookups = action.payload.lookups;

                Object.keys( action.payload.endpoints ).forEach( (key, index ) =>{
                    const epList = action.payload.endpoints[ key ];
                    Object.keys( epList ).forEach( (subKey, subIndex ) =>{
                        action.payload.endpoints[key][subKey] = state.config.host + epList[ subKey ];
                    })

                })
                state.endpoints = action.payload.endpoints;
                state.status.endpointsLoaded = true;
                state.status.lookupsLoaded = true;
            },
            prepare: (lookups: object, endpoints: object ) =>{
                return{
                    payload:{
                        lookups: lookups,
                        endpoints: endpoints
                    }
                }
            }
        },
        setLoginFailed: {
            reducer: (state, action ) => {
                state.status.loggingIn = false;
            }
        },
        setLoggedOut: {
            reducer: (state, action) =>{
                state.status.loggingIn = false;
                state.status.loggedIn = false;
                state.lookups = { };
                state.endpoints = { };
                state.status.endpointsLoaded = true;
                state.status.initialised = false;
            }
        },
        setEndPoints: {
            reducer: (state, action) => {

                state.endpoints = action.payload;
                state.status.endpointsLoaded = true;
            }
        },
        setLookups: {
            reducer: (state, action) => {
                state.lookups = action.payload;
                state.status.lookupsLoaded = true;
            }
        }
    }
})

export const getContext = createAsyncThunk(
    'context/getContext',
    async (initData: {host: string, endPointsUrl: string }, thunkAPI ) => {
        const dispatch = thunkAPI.dispatch;
        const getState = thunkAPI.getState;

        dispatch( setEndPointUrl( initData.host, initData.endPointsUrl ) );

        dispatch( setLoggingIn( {} ) );
        axios.interceptors.request.use( CONFIG.appendAuthHeaders );
        axios.interceptors.response.use( CONFIG.storeRetrievedCredentials );

        //Add ProcessLocationBar later
        
        //Pull the resources
        CONFIG.retrieveResources( dispatch, getState )
            .then( () =>{
                dispatch( setInitialised( {} ) );
            });
    }
)


//TODO: Inefficient, but should be OK for now
export const refreshSchools = createAsyncThunk (
    'context/refreshSchools',
    async ( thunkAPI) => {
        const dispatch = thunkAPI.dispatch;
        const getState = thunkAPI.getState;
        CONFIG.retrieveResources( dispatch, getState );
    }
)

export const emailSignIn = createAsyncThunk(
    'context/emailSignIn',
    async ( params, thunkAPI  ) => {
        const dispatch = thunkAPI.dispatch;
        const getState = thunkAPI.getState;

        dispatch( setLoggingIn);

        if( !params.email || !params.password ){
            dispatch( setLoginFailed( ) );
        } else {
            return axios.post( `${getState().context.config.host}${CONFIG.EMAIL_SIGNIN_PATH}.json`,
                { email: params.email,
                  password: params.password } )
                .then( resp=>{
                    //TODO resp contains the full user info

                    dispatch( addMessage( t( 'sessions.signed_in'), new Date(), Priorities.INFO ))
                    CONFIG.retrieveResources( dispatch, getState )
                        .then( response =>{
                            dispatch( fetchProfile( ) );
                        });
                })
                .catch( error=>{
                    //Handle a failed login properly
                    console.log( 'error', error );
                })

        }
    }
)

//Untested
export const emailSignUp = createAsyncThunk(
    'context/emailSignUp',
    async ( params, thunkAPI  ) => {
        const dispatch = thunkAPI.dispatch;
        const getState = thunkAPI.getState;

        dispatch( setLoggingIn);

        if( !params.email ){
            dispatch( setLoginFailed( ) );

        } else {
            return axios.post( `${getState().context.config.host}${CONFIG.EMAIL_REGISTRATION_PATH}.json`,
                {
                    email: params.email,
                    first_name: params.firstName,
                    last_name: params.lastName
                 } )
                .then( resp=>{
                    const data = resp.data;
                    const priority = data.error ? Priorities.ERROR : Priorities.INFO;
                    dispatch( addMessage( t( data.message ), new Date(), priority ))
                })
                .catch( error=>{
                    console.log( 'error', error );
                })

        }
    }
)

export const oAuthSignIn = createAsyncThunk(
    'context/oAuthSignIn',
    async ( token: string, thunkAPI) => {
        const dispatch = thunkAPI.dispatch;
        const getState = thunkAPI.getState;
        dispatch( setLoggingIn );

        const url = getState().context.endpoints['home'].oauthValidate + '.json';

        axios.post( url, {
            id_token: token
        })
            .then( resp=>{
                //TODO resp contains the full user info
                dispatch( addMessage( resp.data['message'], new Date(), Priorities.INFO ))
                CONFIG.retrieveResources( dispatch, getState )
                    .then( response =>{
                        dispatch( fetchProfile( ) );
                    });
            })
            .catch( error=>{
                //Handle a failed login properly
                console.log( 'error', error );
            })

    }
    
)


export const signOut = createAsyncThunk(
    'context/signOut',
    async( params, thunkAPI ) => {
        const dispatch = thunkAPI.dispatch;
        const getState = thunkAPI.getState;


        if( getState().context.status.loggedIn){
            return axios.delete( `${getState().context.config.host}${CONFIG.SIGN_OUT_PATH}`, {} )
            .then( resp=>{
                dispatch( clearProfile() );
                dispatch( setLoggedOut( ) );
                CONFIG.deleteData( CONFIG.SAVED_CREDS_KEY );
                CONFIG.retrieveResources( dispatch, getState )
                    .then( () =>{
                        dispatch( setInitialised( ) );
                    });

            })
            .catch( error=>{
                //Handle a failed logout properly
                console.log( 'logout error', error );
            })
            //Navigate home
        }

    }
)

const {actions, reducer} = contextSlice;
export const { setEndPoints, setAnonymize, setEndPointUrl, setLoggedIn, setLoggedOut,
    setLoggingIn, setLookups, setInitialised, setLoginFailed } = actions;
export default reducer;
