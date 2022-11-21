import React, { useState } from "react";
import PropTypes from 'prop-types';

import {
  ActivityIndicator
 } from 'react-native-paper';

export default function Skeleton(props) {
  return(
    <ActivityIndicator width={props.width} height={props.height} animating={true} />
  )
}
Skeleton.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};
