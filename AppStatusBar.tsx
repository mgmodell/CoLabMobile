import React from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "./infrastructure/AppReducers";

import { Banner } from 'react-native-paper';

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
          <Banner visible={true}
            actions={[
              {
                label: 'Dismiss',
                onPress: () => {
                  dispatch( acknowledgeMsg( index ) );
                }
              }
            ]}
            >/
              Severity: ${message.priority}
              ${message['text']}
            </Banner>
        );
      })}
      <WorkingIndicator />
    </React.Fragment>
  );
}
