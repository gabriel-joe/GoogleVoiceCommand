import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Picker } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import getEnvVars from '../environment.js';
import { MonoText } from '../components/StyledText';
import { PickerList } from '../components/PickerList';

export default class HomeScreen extends React.Component {
  render() {
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

          <View style={styles.container} contentContainerStyle={styles.contentContainer}>
            <PickerList items={this.state.items} 
               height={50}
               selectedValue={this.state.selectedItem} 
               width={400}
               onValueChange={ (value) => { this.setState({ selectedItem: value })}}/>
          </View>
        </ScrollView>
      </View>
    );
  }
  componentDidMount() {
    this.fetchAllLeagues()
  }

  fetchAllLeagues() {
    fetch('https://www.thesportsdb.com/api/v1/json/1/all_leagues.php')
    .then(response => response.json())
    .then(responseJson => {
        let itemsJson = responseJson.leagues.filter(function (elem, i, array) {
          return elem.strSport == 'Soccer'
        }).map((x,i)=> {
          return( <Picker.Item label={x.strLeague} key={i} value={x}  />)
        })
        this.setState(previousState => ({ items: itemsJson })) 
    }) 
    .catch(error => {
        console.error(error);
    });
  }
  state = {
    items: [],
    selectedItem: null
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
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
