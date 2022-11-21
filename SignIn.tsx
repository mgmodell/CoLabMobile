import React, { useState } from "react";

//Redux store stuff
import { useDispatch } from "react-redux";
import { Priorities, addMessage } from "./infrastructure/StatusSlice";
import EmailValidator from "email-validator";
import { useTranslation } from "react-i18next";

import {
  SafeAreaView,
  View,
} from 'react-native';
import {
  Button,
  TextInput as TextField,
  Text,
} from 'react-native-paper';

import {
  emailSignIn,
  oAuthSignIn,
  emailSignUp
} from "./infrastructure/ContextSlice";

import { GoogleLogin } from "react-google-login";
import { useTypedSelector } from "./infrastructure/AppReducers";
import axios from "axios";

export default function SignIn(props) {
  const category = "devise";
  const { t }: { t: any } = useTranslation(category);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isLoggedIn = useTypedSelector(state => state.context.status.loggedIn);
  const loggingIn = useTypedSelector(state => state.context.status.loggingIn);
  const [curTab, setCurTab] = useState(0);

  const endpointsLoaded = useTypedSelector(
    state => state.context.status.endpointsLoaded
  );
  const profileEndpoints = useTypedSelector(
    state => state.context.endpoints["profile"]
  );
  const oauth_client_ids = useTypedSelector(
    state => state.context.lookups["oauth_ids"]
  );

  //Code to trap an 'enter' press and submit
  //It gets placed on the password field
  const submitOnEnter = evt => {
    if (endpointsLoaded && evt.key === "Enter") {
      dispatch(emailSignIn({email, password}));
      evt.preventDefault();
    }
  };


  const enterLoginBtn = (
    <Button
      disabled={
        "" === email ||
        "" === password ||
        !endpointsLoaded ||
        !EmailValidator.validate(email)
      }
      onPress={() => {
        dispatch(emailSignIn({email, password}));
      }}
    >
      {t("sessions.login_submit")}
    </Button>
  );

  const registerBlock = (
    <React.Fragment>
        <TextField
          label={t("registrations.first_name_fld")}
          id="first_name"
          value={firstName}
          onChange={event => setFirstName(event.target.value)}
        />
        <TextField
          label={t("registrations.last_name_fld")}
          id="last_name"
          value={lastName}
          onChange={event => setLastName(event.target.value)}
          variant="standard"
        />
        <Button
          disabled={"" === email || !endpointsLoaded}
          onPress={() => {
            dispatch(emailSignUp({email: string, firstName: string, lastName: string}));
          }}
        >
          {t("registrations.signup_btn")}
        </Button>
    </React.Fragment>
  );

  const passwordResetBtn = (
      <Button
        disabled={"" === email || !endpointsLoaded}
        onPress={() => {
          const url = profileEndpoints.passwordResetUrl + ".json";

          axios
            .post(url, {
              email: email
            })
            .then(resp => {
              const data = resp.data;
              dispatch(
                addMessage(t(data.message), new Date(), Priorities.INFO)
              );
            })
            .catch(error => {
              console.log("error", error);
            });
        }}
      >
        {t("passwords.forgot_submit")}
      </Button>
  );

  const clearBtn = (
      <Button
        disabled={"" === email && "" === password}
        onPress={() => {
          setPassword("");
          setEmail("");
        }}
      >
        {t("reset_btn")}
      </Button>
  );

  const get_token_from_oauth = response => {
    dispatch(oAuthSignIn(response.tokenId));
  };

  const oauthBtn = (
    <View>

      <Text>Something</Text>
    </View>
    /*
    <GoogleLogin
      clientId={oauth_client_ids["google"]}
      onSuccess={get_token_from_oauth}
      onFailure={response => {
        console.log("login fail", response);
      }}
      cookiePolicy="single_host_origin"
    />
    */
  );

  const emailField = (
      <TextField
        label={t("email_fld")}
        id="email"
        autoFocus
        autoCapitalize={false}
        value={email}
        onChangeText={value => setEmail(value)}
        error={"" !== email && !EmailValidator.validate(email)}
        helperText={
          "" === email || EmailValidator.validate(email)
            ? null
            : "Must be a valid email address"
        }
      />
  );

    return (
      <View>
              {emailField}
                <TextField
                  label="Password"
                  id="password"
                  secureTextEntry={true}
                  value={password}
                  variant="standard"
                  onChangeText={value => setPassword(value)}
                  onKeyDown={submitOnEnter}
                />
            {enterLoginBtn}
            {clearBtn}
            {oauthBtn}

      </View>

    )
    const X = (
      <SafeAreaView >


      <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start' }}>
        <Text>Hi</Text>
        {emailField}
        <Tab onChange={setCurTab} value={curTab}>
            <Tab.Item
              title={t("sessions.login")}
              titleStyle={{ fontSize: 12 }}
            />
            <Tab.Item
              title={t("registrations.signup_tab")}
              titleStyle={{ fontSize: 12 }}
              />
            <Tab.Item title={t("passwords.reset_tab")} />
        </Tab>
        <TabView value={curTab} onChange={setCurTab} animationType='spring'>
          <TabView.Item >
            <View>

            <Text>I love you</Text>
              {emailField}
                <TextField
                  label="Password"
                  id="password"
                  value={password}
                  variant="standard"
                  onChange={event => setPassword(event.target.value)}
                  onKeyDown={submitOnEnter}
                />
            {enterLoginBtn}
            {clearBtn}
            {oauthBtn}
            </View>
          </TabView.Item>
          <TabView.Item>
            <View>

            <Text>I hate you</Text>
              {emailField}
              {registerBlock}
              {clearBtn}
            </View>
          </TabView.Item>
          <TabView.Item>
            <View>

            <Text>I medium you</Text>
              {emailField}
              {passwordResetBtn}
              {clearBtn}

            </View>
          </TabView.Item>

        </TabView>
      </View>
      </SafeAreaView>
    )
}
    
    
SignIn.propTypes = {};
