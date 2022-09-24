import React, { useState, Suspense, useEffect } from "react";
import { useLocation } from "react-router-native";

import PropTypes from "prop-types";
import {
  Button,
  Icon,
} from "@rneui/themed";

//import { i18n } from "./infrastructure/i18n";
import { useTranslation } from "react-i18next";

import ExperienceInstructions from "./ExperienceInstructions";

export default function HelpMenu(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [t, i18n] = useTranslation();

  const location = useLocation();
  const [helpMe, setHelpMe] = useState(false);

  return (
      <Button
        id="help-menu-button"
        color="secondary"
        aria-controls="help-menu"
        aria-haspopup="true"
        size='lg'
      >
        <Icon 
          name='help'
          type='materialIcons'
          />
      </Button>
  );
}

HelpMenu.propTypes = {};
