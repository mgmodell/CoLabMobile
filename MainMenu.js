import React, { useState, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";

import PropTypes from "prop-types";
import { BrowserRouter as Router, useNavigate } from "react-router-native";
import {
  ListItem,
  Divider,
  Icon,
  Button,
} from '@rneui/themed';

import DiversityCheck from "./DiversityCheck";
import { useTranslation } from "react-i18next";

import { useTypedSelector } from "./infrastructure/AppReducers";
import { signOut } from "./infrastructure/ContextSlice";

export default function MainMenu(props) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [t, i18n] = useTranslation();
  const isLoggedIn = useTypedSelector(state => state.context.status.loggedIn);
  const user = useTypedSelector(state => state.profile.user);

  const dispatch = useDispatch();

  const toggleDrawer = event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (menuOpen) {
      setAdminOpen(false);
    }
    setMenuOpen(!menuOpen);
  };

  const navTo = url => {
    navigate(url);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navTo( '/' );
    }
  }, [isLoggedIn]);

  const adminItems =
    isLoggedIn && (user.is_instructor || user.is_admin) ? (
      <React.Fragment>
        <Divider />
        <ListItem
          id="administration-menu"
          onPress={() => setAdminOpen(!adminOpen)}
        >
          <Icon name='settings' type='feather' />
          <ListItem.Title>
            {t("administration")} {adminOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem.Title>
        </ListItem>

        <ListItem.Accordion isExpanded={adminOpen}>
          <Divider />
          <ListItem
            onPress={()=> {navTo( '/admin/courses' )}}
          >
            <Icon name='google-classroom' type='material' />
            <ListItem.Title>{t('courses_edit')}</ListItem.Title>
          </ListItem>
          <ListItem
            onPress={()=> {navTo( '/admin/reporting' )}}
          >
            <Icon name='chart-multiline' type='material' />
            <ListItem.Title>{t('reporting')}</ListItem.Title>
          </ListItem>
          {user.is_admin ? (
            <React.Fragment>
              <ListItem
                onPress={()=> {navTo( '/admin/concepts' )}}
              >
                <Icon name='dynamic-feed' type='material' />
                <ListItem.Title>{t('concepts_edit')}</ListItem.Title>
              </ListItem>
              <ListItem
                onPress={()=> {navTo( '/admin/schools' )}}
              >
                <Icon name='school' type='font-awesome-5' />
                <ListItem.Title>{t('schools_edit')}</ListItem.Title>
              </ListItem>
              <ListItem
                onPress={()=> {navTo( '/admin/consent_forms' )}}
              >
                <Icon name='find-in-page' type='material' />
                <ListItem.Title>{t('consent_forms_edit')}</ListItem.Title>
              </ListItem>

            </React.Fragment>
          ) : null}
          <Divider />

        </ListItem.Accordion>
      </React.Fragment>
    ) : null;

  const basicOpts = isLoggedIn ? (
    <React.Fragment>
      <ListItem id="home-menu-item" onPress={() => navTo("/")}>
        <Icon name='home' type='material' />
        <ListItem.Title>{t('home.title')}</ListItem.Title>
      </ListItem>
      <ListItem id="profile-menu-item" onPress={() => navTo("/profile")}>
        <Icon name='account-box' type='material' />
        <ListItem.Title>{t('profile')}</ListItem.Title>
      </ListItem>
      <DiversityCheck diversityScoreFor={props.diversityScoreFor} />
    </React.Fragment>
  ) : (
      <ListItem id="home-menu-item" onPress={() => navTo("/")}>
        <Icon name='home' type='material' />
        <ListItem.Title>{t('home.title')}</ListItem.Title>
      </ListItem>
  );

  const logoutItem = isLoggedIn ? (
    <ListItem
      id="logout-menu-item"
      button
      onClick={() => {
        dispatch(signOut());
        setMenuOpen(false);
      }}
    >
      <ListItemIcon>
        <ExitToAppIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{t("logout")}</ListItemText>
    </ListItem>
  ) : null;

  return (
    <React.Fragment>
      <Button type='clear'
        icon={(
          <Icon name='menu' type='material' />
        )}
        aria-controls="main-menu"
        aria-haspopup="true"
        onPress={toggleDrawer} />

      <SwipeableDrawer
        anchor="left"
        open={menuOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <List id="main-menu-list">
          {basicOpts}
          {adminItems}
          <Divider />
          <ListItem id="demo-menu-item" button onClick={() => navTo("/demo")}>
            <ListItemIcon>
              <RateReviewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("titles.demonstration")}</ListItemText>
          </ListItem>
          <ListItem
            id="support-menu-item"
            button
            onClick={() => {
              window.location = "mailto:" + props.supportAddress;
            }}
          >
            <ListItemIcon>
              <ContactSupportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("support_menu")}</ListItemText>
          </ListItem>
          <ListItem
            id="about-menu-item"
            button
            onClick={() => {
              window.location.href = props.moreInfoUrl;
            }}
          >
            <ListItemIcon>
              <InfoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("about")}</ListItemText>
          </ListItem>
          {logoutItem}
        </List>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

MainMenu.propTypes = {
  diversityScoreFor: PropTypes.string.isRequired,
  reportingUrl: PropTypes.string,
  supportAddress: PropTypes.string.isRequired,
  moreInfoUrl: PropTypes.string.isRequired
};
