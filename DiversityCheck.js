import React, {useState, Suspense } from "react";
import PropTypes from "prop-types";

import {
  FlatList,
} from 'react-native';

import {
  Button,
  Dialog,
  Divider,
  Icon,
  Input,
  ListItem,
  Text
} from '@rneui/themed';

import { useTranslation } from "react-i18next";

import axios from "axios";

export default function DiversityCheck (props){

  const [emails, setEmails] = useState( '' );
  const [dialogOpen, setDialogOpen] = useState( false );
  const [diversityScore, setDiversityScore] = useState( null );
  const [foundUsers, setFoundUsers ] = useState( [] );

  const [ t ] = useTranslation( );

  function calcDiversity() {
    const url = props.diversityScoreFor + ".json";
    axios
      .post(url, {
        emails: emails
      })
      .then(response => {
        const data = response.data;
        setDiversityScore( data.diversity_score );
        setFoundUsers( data.found_users );
      })
      .catch(error => {
        console.log("error", error);
        return [{ id: -1, name: "no data" }];
      });
  }
  function handleClear() {
    setEmails( '' );
    setDiversityScore( null );
    setFoundUsers( [] );
  }

  function openDialog() {
    setDialogOpen( true );
  }

  function closeDialog() {
    setDialogOpen( false );
  }

  function handleChange( event ){
    setEmails( event.target.value );
  }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ListItem onPress={openDialog} >
          <ListItem.Content>
            <Icon name='compare' type="MaterialCommunityIcons" />
            <ListItem.Title>
              {t('calc_diversity')}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <Dialog isVisible={dialogOpen}
                aria-labelledby={t("calc_it")} >

                <Dialog.Title>{t("calc_it")}</Dialog.Title>
                <Text>{t('ds_emails_lbl')}</Text>
                <Input value={emails} onChange={handleChange} />
                <Dialog.Actions>
                    <Dialog.Button
                      variant="contained"
                      onClick={calcDiversity}
                    >
                      {t("calc_diversity_sub")}
                    </Dialog.Button>
                    <Dialog.Button
                      variant="contained"
                      onClick={handleClear}
                    >
                      {t('clear')}
                    </Dialog.Button>
                </Dialog.Actions>
          <Text>{diversityScore}</Text>
          <Divider/>
          <FlatList data={foundUsers}
                    renderItem={(user)=>{
                      return(
                        <Text onPress={(user)=>{
                          Linking.openURL("mailto:${user.email}")
                        }}>
                          {user.name}
                        </Text>
                      )
                    }
                    }
                    />
        </Dialog>
      </Suspense>
    );
}

DiversityCheck.propTypes = {
  diversityScoreFor: PropTypes.string.isRequired
};
