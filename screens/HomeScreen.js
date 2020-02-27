import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Picker, TextInput, Button, Alert, StatusBar } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import getEnvVars from '../environment.js';
import { MonoText } from '../components/StyledText';
import { PickerList } from '../components/PickerList';
import API from '../constants/ApiUrl.js'
import { AppLoading } from 'expo';

export default class HomeScreen extends React.Component {
  render() {
    /* if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._fetchAllLeagues.bind(this)}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); } */
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
                onChangeText={text => this.setState({searchText: text})}
                placeholder="Team"
                value={this.state.value}
              />
              <Button
                title="Search"
                style={{ textAlign: 'center' }}
                onPress={() => this.getTeamByName()}
              />
          </View>
          <View style={styles.container} contentContainerStyle={styles.contentContainer}>
            <PickerList items={this.state.teamsPicker} 
               height={50}
               enabled={this.state.teamsPicker.length > 0}
               selectedValue={this.state.selectedItem} 
               width={350}
               onValueChange={ (value) => { this.setState({ selectedItem: value })}}/>
          </View>
          <StatusBar backgroundColor="black" barStyle="dark-content" currentHeight='100' animated={true} hidden={ false } visibleStatusBar={true}/>
        </ScrollView>
      </View>
    );
  }

  getTeamByName() {
    fetch(API.urlFindTeamByName + this.state.searchText)
    .then(response => response.json())
    .then(responseJson => {
        let leaguesFilter = []
        responseJson.teams.forEach(element => {
           let team = {
             'idTeam': element.idTeam,
             'idLeague': element.idLeague,
             'league': element.strLeague,
             'team': element.strTeam
           }
           leaguesFilter.push(team)
        });
        console.log(leaguesFilter)
        let leaguesPicker = leaguesFilter.map((x,i)=> {
          return( <Picker.Item label={x.team + ' - ' + x.league} key={i} value={x}  />)
        })
        this.setState({teams: leaguesFilter, teamsPicker: leaguesPicker})
        console.log(this.state.team)
    })
    .catch(error => {
        console.error(error);
    });
  }
  state = {
    teamsPicker: [],
    teams: [],
    selectedItem: null,
    searchText: null,
    team: null,
    isReady: false
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
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
