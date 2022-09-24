import React from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "./infrastructure/AppReducers";

import { View } from "react-native";
import {
  Card,
  Icon,
  Text,
} from '@rneui/themed';

import { acknowledgeMsg } from "./infrastructure/StatusSlice";
import WorkingIndicator from "./infrastructure/WorkingIndicator";

import CloseIcon from "@mui/icons-material/Close";

export default function AppStatusBar(props) {
  const messages = useTypedSelector(state => {
    return state.status.messages;
  });
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      {messages.map((message, index) => {
        return !message['dismissed'] && (
          <Card key={`collapse_${index}`} >
            <Card.FeaturedTitle>Severity: ${message.priority}</Card.FeaturedTitle>
            <Card.Divider />
            <Card.FeaturedSubtitle>${message['text']}</Card.FeaturedSubtitle>
            <Icon name='close'
              type='fontawesome'
              onPress={ () =>{
                    dispatch(acknowledgeMsg(index));
              }
            } />
          </Card>
        );
      })}
      <WorkingIndicator />
    </React.Fragment>
  );
}
