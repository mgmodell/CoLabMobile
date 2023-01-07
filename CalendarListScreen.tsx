import React, {useState, useEffect, useMemo, useCallback} from 'react';
import axios from 'axios';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextStyle} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {
  List
} from 'react-native-paper';

import { useDispatch } from 'react-redux';
import { startTask, endTask } from './infrastructure/StatusSlice';
import { useTypedSelector } from './infrastructure/AppReducers';
import { useTranslation } from 'react-i18next';


const RANGE = 24;
//const initialDate = '2022-12-09';
//const nextWeekDate = '2022-12-16';
//const nextMonthDate = '2023-01-05';

interface Props {
  horizontalView?: boolean;
}

const CalendarListScreen = (props: Props) => {
  const category = 'home';
  const endpoints = useTypedSelector(
    state => state.context.endpoints[category]
  );
  const endpointsLoaded = useTypedSelector(
    state => state.context.status.endpointsLoaded
  );
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const isLoggedIn = useTypedSelector(state => state.context.status.loggedIn);
  const user = useTypedSelector(state => state.profile.user);
  const tz_hash = useTypedSelector(
    state => state.context.lookups.timezone_lookup
    );

  const [tasks, setTasks] = useState([]);

  const initialDate = new Date( ).toISOString( );

  const getTasks = () => {
    const url = `${endpoints.taskListUrl}.json`;

    dispatch(startTask());
    axios.get(url, {}).then(resp => {
      //Process the data

      const data = resp.data;
      console.log( data );
      data["tasks"].forEach((value, index, array) => {
        switch (value.type) {
          case "assessment":
            value.title = value.group_name + " for (" + value.name + ")";
            break;
          case "bingo_game":
            value.title = value.name;
            break;
          case "experience":
            value.title = value.name;
            break;
        }
        if (props.rootPath === undefined) {
          value.url = value.link;
        } else {
          const url = `/${props.rootPath}${value.link}`;
          value.url = url;
          value.link = url;
        }
        // Set the dates properly - close may need work

        value.start = value.next_date;
        if (null !== value.next_date) {
          value.next_date = new Date(value.next_date);
        }

        if (null !== value.start_date) {
          value.start_date = new Date(value.start_date);
        }
      });
      setTasks(data.tasks);
      //setConsentLogs(data.consent_logs);
      //setWaitingRosters(data.waiting_rosters);

      dispatch(endTask());
    });
  };

  useEffect(() => {
    if (props.rootPath !== undefined || (endpointsLoaded && isLoggedIn)) {
      getTasks();
    }
  }, [endpointsLoaded, isLoggedIn]);

  const {horizontalView} = props;
  const taskColor = {
    'assessment': 'blue',
    'experience': 'green',
    'bingo_game': 'orange'
  };

  const [selected, setSelected] = useState(initialDate);
  const marked = useMemo(() => {
    const markedMap = {};
    tasks.forEach( task =>{

      const start = new Date( task.start_date ).toISOString( ).split( 'T' )[0];
      const end = new Date( task.end_date ).toISOString( ).split( 'T' )[0];
      markedMap[ start ] = {
        textColor: taskColor[ task.type ],
        startingDay: true,
      }
      markedMap[ end ] = {
        textColor: taskColor[ task.type ],
        endingDay: true,
      }

    })
    markedMap [selected] = {
        selected: true,
        disableTouchEvent: true,
        selectedColor: '#5E60CE',
        selectedTextColor: 'white'
    }
    console.log( 'markedMap', markedMap );
    return markedMap;
    return {
      [nextWeekDate]: {
        selected: selected === nextWeekDate,
        selectedTextColor: '#5E60CE',
        marked: true
      },
      [nextMonthDate]: {
        selected: selected === nextMonthDate,
        selectedTextColor: '#5E60CE',
        marked: false
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: '#5E60CE',
        selectedTextColor: 'white'
      }
    };
  }, [tasks, selected]);

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

  const taskList= tasks.map( (task) =>{
            return(
              <List.Item
                title={task.name}
                key={task.id}
              />
             )
          } );

  return (
    <React.Fragment>
    <View style={{flex: 1}}>
      <View style={{ flex: .5 }} >

        <Calendar

          markingType='period'
          current={initialDate}

          minDate={initialDate}
          pastScrollRange={1}
          futureScrollRange={RANGE}
          onDayPress={onDayPress}
          markedDates={marked}
          renderHeader={!horizontalView ? renderCustomHeader : undefined}
          calendarHeight={!horizontalView ? 390 : undefined}
          theme={!horizontalView ? theme : undefined}
          horizontal={horizontalView}
          pagingEnabled={horizontalView}
          staticHeader={horizontalView}
        />

      </View>
      <View style={{ flex: .5}} >
        <Text>Hello</Text>
        <ScrollView>
          {taskList}
        </ScrollView>

      </View>
    </View>
    </React.Fragment>
  );
};

const theme = {
  stylesheet: {
    calendar: {
      header: {
        dayHeader: {
          fontWeight: '600',
          color: '#48BFE3'
        }
      }
    }
  },
  'stylesheet.day.basic': {
    today: {
      borderColor: '#48BFE3',
      borderWidth: 0.8
    },
    todayText: {
      color: '#5390D9',
      fontWeight: '800'
    }
  }
};

function renderCustomHeader(date: any) {
  const header = date.toString('MMMM yyyy');
  const [month, year] = header.split(' ');
  const textStyle: TextStyle = {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    color: '#5E60CE',
    paddingRight: 5
  };

  return (
    <View style={styles.header}>
      <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
      <Text style={[styles.year, textStyle]}>{year}</Text>
    </View>
  );
}

export default CalendarListScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10
  },
  month: {
    marginLeft: 5
  },
  year: {
    marginRight: 5
  }
});
