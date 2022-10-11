import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Svg, { Line, Stop, LinearGradient, Circle, G } from 'react-native-svg';


  if (global.__fbBatchedBridge) {
    console.log( 'stinky' );
    const origMessageQueue = global.__fbBatchedBridge;
    const modules = origMessageQueue._remoteModuleTable;
    const methods = origMessageQueue._remoteMethodTable;
    global.findModuleByModuleAndMethodIds = (moduleId, methodId) => {
      console.log(`The problematic line code is in: ${moduleId}:${modules[moduleId]}.${methodId}:${methods[moduleId][methodId]}`)
    }
    global.findModuleByModuleAndMethodIds(47,17);
    global.findModuleByModuleAndMethodIds(70,1);
    global.findModuleByModuleAndMethodIds(70,0);
    global.findModuleByModuleAndMethodIds(47,6);

  }
  console.log( 'I hate you' );

export default function Logo(props) {

  const height = props.height || 72;
  const width = props.width || 72;
  const mounted = useRef(false);

  const viewBox = [0, 0, 1000, 1000].join(" ");

  const [colors, setColors] = useState([
    "#00FF00",
    "#FF2A2A",
    "#FFFF00",
    "#FF6600",
    "#FF00FF"
  ]);
  const center = { x: 450, y: 455 };
  const [points, setPoints] = useState([
    { x: 124, y: 135 },
    { x: 568, y: 134 },
    { x: 790, y: 530 },
    { x: 610, y: 790 },
    { x: 120, y: 710 }
  ]);

  const [green, setGreen] = useState(colors[0]);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function rotateColors() {
    colors.push(colors.shift());
    setColors(colors);
    if (mounted) {
      setGreen(colors[0]);
    }
  }

  async function spinning() {
    while (true) {
      if (props.spinning) {
        rotateColors();
      }
      await sleep(100);
    }
  }

  useEffect(() => {
    spinning();
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function spinIt() {
    if (!props.spinning) {
      for (let index = 0; index < 15; index++) {
        rotateColors();
        await sleep(Math.log(index, 1000) * 100);
      }
    }
  }

  return (
    <Svg
      height={height}
      width={width}
      //onPress={spinIt}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      //xmlns="http://www.w3.org/2000/svg"
    >
      <LinearGradient
        id="backdrop"
        x1="-5"
        y1="493"
        x2="975"
        y2="493"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopColor="#ffffff" stopOpacity="25%" />
        <Stop offset="1" stopColor="#c8c8c8" stopOpacity="100%" />
      </LinearGradient>
      <Circle
        id="background"
        cx="485"
        cy="493"
        r="490"
        fill="url(#backdrop)"
      />
      <G id="circles" stroke="black" strokeWidth="30">
        <Line x1={center.x} y1={center.y} x2={points[0].x} y2={points[0].y} />
        <Line x1={center.x} y1={center.y} x2={points[1].x} y2={points[1].y} />
        <Line x1={center.x} y1={center.y} x2={points[2].x} y2={points[2].y} />
        <Line x1={center.x} y1={center.y} x2={points[3].x} y2={points[3].y} />
        <Line x1={center.x} y1={center.y} x2={points[4].x} y2={points[4].y} />
        <Circle id="desk" cx={center.y} cy={center.y} r="160" fill="#00FFFF" />
        <G id="teammates" strokeWidth="20">
          <Circle
            id="green"
            cx={points[0].x}
            cy={points[0].y}
            r="82"
            fill={green}
          />
          <Circle
            id="red"
            cx={points[1].x}
            cy={points[1].y}
            r="80"
            fill={colors[1]}
          />
          <Circle
            id="yellow"
            cx={points[2].x}
            cy={points[2].y}
            r="85"
            fill={colors[2]}
          />
          <Circle
            id="orange"
            cx={points[3].x}
            cy={points[3].y}
            r="81"
            fill={colors[3]}
          />
          <Circle
            id="purple"
            cx={points[4].x}
            cy={points[4].y}
            r="80"
            fill={colors[4]}
          />
        </G>
      </G>
    </Svg>
  );

  Logo.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    spinning: PropTypes.bool
  };
}
