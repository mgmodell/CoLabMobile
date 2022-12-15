import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from '@rneui/base';

export default function CheckInScreen( {navigation, route}){
    //console.log(  props.navigation, props.route);
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
          fontSize: 20,
          marginLeft: 30,
          marginRight:30,
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
      
      return (
    <View style={styles.layout}>
      <Text style={styles.title}>{route.params?.dimensionName}</Text>
      <Text style={styles.paragraph}>basic.instructions </Text>
      <Text style={styles.paragraph}>slider.instructions</Text>
      
    
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
      />
     <Text></Text>
      <Button
        title="return to Previous Dimension"
        onPress={() => {
          
          navigation.navigate('Dimension 1', {
            
                dimensionName: 'flexibility'
             
          });
        }}
      />
    </View>  
  );  
}


  