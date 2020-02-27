import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Picker, TextInput, Button, Alert, StatusBar,Dimensions,ToastAndroid,ActivityIndicator  } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import getEnvVars from '../environment.js';
import { PickerList } from '../components/PickerList';
import API from '../constants/APIEndpoint.js';
import {
  ProgressChart,
  LineChart,
  PieChart
} from "react-native-chart-kit";

export default class HomeScreen extends React.Component {
  render() {
    return <ViewConditioning component={this}/>
  }

  getTeamByName() {
    this.setState({ team: null, data: [],isLoading: true })
    fetch(API.urlFindTeamByName + this.state.searchText)
    .then(response => response.json())
    .then(responseJson => {
        this.setState({isLoading: false})
        if(responseJson.teams != null)
          this.loadTeamsLeague(responseJson)
        else
          ToastAndroid.showWithGravity('Not found', ToastAndroid.SHORT, ToastAndroid.CENTER);
        this.setState({isLoading: false})
    })
    .catch(error => {
        console.error(error);
        this.setState({isLoading: false})
    });
  }

  setTeam(value) {
    this.setState({ team: value })
    this.retrieveHistory(value)
  }

  loadTeamsLeague(responseJson) {
    let leaguesFilter = []
    responseJson.teams.forEach((element,i) => {
        if(element.strSport == 'Soccer') {
          let team = {
            'idTeam': element.idTeam,
            'idLeague': element.idLeague,
            'league': element.strLeague,
            'team': element.strTeam
          }
          leaguesFilter.push(team)
          if(i == 0) this.setTeam(team)
        }
    });
    let leaguesPicker = leaguesFilter.map((x,i)=> {
      return( <Picker.Item label={x.team + ' - ' + x.league} key={i} value={x}  />)
    })
    this.setState({team: null, teams: leaguesFilter, teamsPicker: leaguesPicker})
  }

  retrieveHistory(team) {
    this.setState({isLoading: true})
    fetch(API.urlGetTheLast5Games + team.idTeam)
    .then(response => response.json())
    .then(responseJson => {
      this.loadChart(responseJson, team.idTeam)
      this.setState({isLoading: false})
    })
    .catch(error => {
      console.error(error);
      this.setState({isLoading: false})
    });
    
  }

  loadChart(responseJson, idTeam) {
    let win = 0
    let lose = 0
    let draw = 0
    responseJson.results.forEach(element => {
      var homeTeam = false
      if(element.idHomeTeam == idTeam) {
        win += element.intHomeScore > element.intAwayScore ? 1 : 0
        draw += element.intHomeScore == element.intAwayScore ? 1 : 0
        lose += element.intAwayScore > element.intHomeScore ? 1 : 0
      } else {
        win += element.intAwayScore > element.intHomeScore ? 1 : 0
        draw += element.intHomeScore == element.intAwayScore ? 1 : 0
        lose += element.intHomeScore > element.intAwayScore ? 1 : 0
      }
    });
    this.setState({data: []})
    this.populateChart('Win', win, 'green')
    this.populateChart('Draw', draw, 'blue')
    this.populateChart('Lose', lose, 'red')
  }

  populateChart(label, count, color) {
    var option = Object.assign({}, this.state.dataOption);
    option.name = label
    option.count = count
    option.color = color
    let dataTemp = this.state.data
    dataTemp.push(option)
    this.setState({ data: dataTemp })
  }

  state = {
    teamsPicker: [],
    teams: [],
    selectedItem: null,
    searchText: null,
    team: null,
    dataOption: {
      name: "",
      count: 0,
      color: "",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    data: [],
    isLoading: false
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function ViewConditioning(props) {
    if(props.component.state.isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView style={[styles.container]} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 30,
              paddingLeft: 10,
              marginBottom: 10,
              justifyContent: 'flex-start',
              alignItems: 'stretch'
            }}>
              <TextInput
                style={{ borderColor: 'gray', borderWidth: 1, width: 150, marginRight: 15 }}
                onChangeText={text => props.component.setState({searchText: text})}
                placeholder="Team"
                value={props.component.state.value}
              />
              <Button
                title="Search"
                style={{ textAlign: 'center' }}
                onPress={() => props.component.getTeamByName()}
              />
          </View>
          <View style={styles.container} contentContainerStyle={styles.contentContainer}>
            <PickerList items={props.component.state.teamsPicker} 
               height={50}
               enabled={props.component.state.teamsPicker.length > 0}
               selectedValue={props.component.state.team} 
               width={350}
               onValueChange={ (value) => { props.component.setTeam(value) } }/>
          </View>
          <View style={styles.spacedContainer} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.containerText}>
              Team history
            </Text>
            <PieChart
              data={props.component.state.data}
              width={Dimensions.get("window").width}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          
        </ScrollView>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  spacedContainer: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  containerText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 20,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 25
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5
};

const dataa = [
  {
    name: "Lost",
    population: 10,
    color: "green",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Draw",
    population: 40,
    color: "blue",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Victory",
    population: 60,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }
];