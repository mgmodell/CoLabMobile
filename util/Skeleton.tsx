import React, { useState } from "react";
import PropTypes from 'prop-types';

import {
  Skeleton as SkRNEUI,
 } from '@rneui/themed';

export default function Skeleton(props) {
  return(
    <SkRNEUI width={props.width} height={props.height} animation='wave' />
  )
}
Skeleton.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};
