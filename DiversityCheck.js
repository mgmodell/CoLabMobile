import React, {useState, Suspense } from "react";
import PropTypes from "prop-types";

import {
  FlatList,
} from 'react-native';

import {
  Dialog,
  Divider,
  Input,
  List,
  TextInput
} from 'react-native-paper';

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
        <List.Item onPress={openDialog} />
          <List.Item
              title={t('calc_diversity')}
              left={props => <List.Icon {...props} icon='compare' />}

          />
        <Dialog isVisible={dialogOpen}
                aria-labelledby={t("calc_it")} >

                <Dialog.Title>{t("calc_it")}</Dialog.Title>
                <Dialog.Content>
                  <Text>{t('ds_emails_lbl')}</Text>
                </Dialog.Content>
                <Input value={emails} onChange={handleChange} />
                <Dialog.Actions>
                    <Button
                      variant="contained"
                      onClick={calcDiversity}
                    >
                      {t("calc_diversity_sub")}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleClear}
                    >
                      {t('clear')}
                    </Button>
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
