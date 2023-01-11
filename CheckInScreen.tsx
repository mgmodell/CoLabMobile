import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from 'react-native-paper';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { startTask, endTask, setDirty } from './infrastructure/StatusSlice';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from './infrastructure/AppReducers';

export default function CheckInScreen( {navigation, route}){
    console.log(  navigation, route);
    const styles = StyleSheet.create({
        layout: {
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          fontWeight: 'bold',
        },
        title: {
          fontSize: 25,
          marginBottom: 16,
      
        },
        paragraph: {
          fontSize: 12,
          marginLeft: 15,
          marginRight:15,
          marginTop:30,
          
        },
        container: {
          flex: 1,
          marginLeft: 10,
          marginRight: 10,
          alignItems: 'stretch',
          justifyContent: 'center',
        }
        
      });
      
      const endpointSet = "installment";
      const endpoints = useTypedSelector(
        state => state.context.endpoints[endpointSet]
      );
      const endpointStatus = useTypedSelector(
        state => state.context.status.endpointsLoaded
      );
      const user = useTypedSelector(state => state.profile.user);
      const dispatch = useDispatch( );
      const [t, i18n] = useTranslation( 'installments' );

      const [dirty, setDirty] = useState( false );
      const [project, setProject] = useState( {} );
      const [group, setGroup] = useState( { users: {} } );
      const [factors, setFactors] = useState( {} );


      const [sliderSum, setSliderSum] = useState( 0 );
      const [contributions, setContributions] = useState( {} );
      const [installment, setInstallment] = useState( { comments: '' } );
      const [messages, setMessages] = useState( {} );
      const [showAlerts, setShowAlerts] = useState( false );

      useEffect( () => setDirty( true ), [contributions, installment]);
      useEffect( () => {
        if( endpointStatus){
          getContributions( );
        }
      }, [endpointStatus])
      
      //Retrieve the latest data
  const userCompare = (b, a) => {
    var retVal = 0;
    if( user.id == a.userId){
      retVal = +1;
    } else {
      retVal = a.name.localeCompare(b.name);
    }
    return retVal;
  };
  const getContributions = () => {
    const url =
        `${endpoints.baseUrl}${route.params.assessmentId}.json`

    dispatch(startTask());
    axios
      .get(url, {})
      .then(response => {
        const data = response.data;
        const factorsData = Object.assign({}, data.factors);
        setFactors(factorsData);

        setSliderSum(data.sliderSum);

        //Process Contributions
        const contributions = data.installment.values.reduce(
          (valuesAccum, value) => {
            const values = valuesAccum[value.factor_id] || [];
            values.push({
              userId: value.user_id,
              factorId: value.factor_id,
              name: data.group.users[value.user_id].name,
              value: value.value
            });
            valuesAccum[value.factor_id] = values.sort(userCompare);
            return valuesAccum;
          },
          {}
        );
        delete data.installment.values;
        setInstallment(data.installment);

        setContributions(contributions);
        setDirty(false);
        setGroup(data.group);

        console.log( 'group', data.group );
        data.installment.group_id = data.group.id;

        setProject(data.installment.project);
        //setInitialised(true);
        dispatch(endTask());
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  //Store what we've got
  const saveContributions = () => {
    dispatch(startTask("saving"));
    const url =
      endpoints.saveInstallmentUrl +
      (Boolean(installment.id) ? `/${installment.id}` : ``) +
      ".json";
    const method = Boolean(installment.id) ? "PATCH" : "POST";

    const body = {
      contributions: contributions,
      installment: installment
    };
    axios({
      url: url,
      method: method,
      data: body
    })
      .then(response => {
        const data = response.data;
        //Process Contributions
        if (!data.error) {
          setInstallment(data.installment);
          const receivedContributions = data.installment.values.reduce(
            (valuesAccum, value) => {
              const values = valuesAccum[value.factor_id] || [];
              values.push({
                userId: value.user_id,
                factorId: value.factor_id,
                name: group["users"][value.user_id].name || "",
                value: value.value
              });
              valuesAccum[value.factor_id] = values.sort(userCompare);
              return valuesAccum;
            },
            {}
          );
          setContributions(receivedContributions);
        }
        setMessages(data.messages);
        setShowAlerts(true);
        dispatch(endTask("saving"));
        setDirty(false);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

      return (
    <View style={styles.layout}>
      <Text style={styles.title}>{route.params?.dimensionName}</Text>
      <Text style={styles.paragraph}>{t('basic.instructions')} </Text>
      <Text style={styles.paragraph}>{t('slider.instructions')}</Text>
      
    
      {
        Object.values( group.users).map( (member)=>{

          console.log( member );
        return(
          <Text>{member.name}</Text>
        )

        })
      }
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        />
        <Text>Jane</Text>
        <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        />
        <Text>John</Text>
        <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        />
        <Text>Jenny</Text>
        <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        />
        <Text>Josh</Text>
        <Text></Text>
        <Button
        title="Continue to Next Dimension"
        onPress={() => {
          
          navigation.navigate('Dimension 1', {
            
                dimensionName: 'non-flexibility'
             
          });
        }}
      >return to Previous Dimension</Button>
     <Text></Text>
      <Button
        title="return to Previous Dimension"
        onPress={() => {
          
          navigation.navigate('Dimension 1', {
            
                dimensionName: 'flexibility'
             
          });
        }}
      >return to Previous Dimension</Button>
    </View>  
  );  
}


  