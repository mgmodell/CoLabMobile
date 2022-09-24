import React, { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-native";
//Redux store stuff
import { useDispatch } from "react-redux";
import { Priorities, addMessage } from "./infrastructure/StatusSlice";
import EmailValidator from "email-validator";
import { useTranslation } from "react-i18next";

import {
  Button,
  Input as TextField,
  Overlay,
  Tab,
  Text,

} from '@rneui/themed';

import {
  emailSignIn,
  oAuthSignIn,
  emailSignUp
} from "./infrastructure/ContextSlice";

import { GoogleLogin } from "react-google-login";
import { useTypedSelector } from "./infrastructure/AppReducers";
import axios from "axios";
import { TabView } from "@rneui/base";

export default function SignIn(props) {
  const category = "devise";
  const { t }: { t: any } = useTranslation(category);

  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

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
      dispatch(emailSignIn({email, password})).then(navigate(from));
      evt.preventDefault();
    }
  };

  const from = undefined != state ? state.from : "/";

  const enterLoginBtn = (
    <Button
      disabled={
        "" === email ||
        "" === password ||
        !endpointsLoaded ||
        !EmailValidator.validate(email)
      }
      onPress={() => {
        dispatch(emailSignIn({email, password})).then(navigate(from));
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
            dispatch(emailSignUp({email: string, firstName: string, lastName: string})).then(
              navigate(from)
            );
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
    <GoogleLogin
      clientId={oauth_client_ids["google"]}
      onSuccess={get_token_from_oauth}
      onFailure={response => {
        console.log("login fail", response);
      }}
      cookiePolicy="single_host_origin"
    />
  );

  const emailField = (
      <TextField
        label={t("email_fld")}
        id="email"
        autoFocus
        value={email}
        onChange={event => setEmail(event.target.value)}
        error={"" !== email && !EmailValidator.validate(email)}
        helperText={
          "" === email || EmailValidator.validate(email)
            ? null
            : "Must be a valid email address"
        }
      />
  );

  console.log( 'sign in widget', loggingIn, isLoggedIn );
  if (isLoggedIn) {
    return <Navigate replace to={state.from || "/"} />;
  } else {
    return (
      <React.Fragment>
        <Overlay isVisible={loggingIn} >
          <Text>Loading...</Text>
        </Overlay>
        <Tab onChange={setCurTab} value={curTab}>
            <Tab label={t("sessions.login")} />
            <Tab label={t("registrations.signup_tab")} />
            <Tab label={t("passwords.reset_tab")} />
        </Tab>
        <TabView value={curTab} onChange={setCurTab} animationType='spring'>
          <TabView.Item >
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
          </TabView.Item>
          <TabView.Item>
              {emailField}
              {registerBlock}
              {clearBtn}

          </TabView.Item>
          <TabView.Item>
              {emailField}
              {passwordResetBtn}
              {clearBtn}

          </TabView.Item>

        </TabView>
      </React.Fragment>
    );
  }
}
SignIn.propTypes = {};
