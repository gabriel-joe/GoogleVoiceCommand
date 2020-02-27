import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenOrientation } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import * as Speech from 'expo-speech';
import * as TaskManager from 'expo-task-manager';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <OptionButton
        icon="md-school"
        label="Read the Expo documentation"
        onPress={() => WebBrowser.openBrowserAsync('https://docs.expo.io')}
      />

      <OptionButton
              icon="md-settings"
              label="Change app orientation"
              onPress={() => changeAppOrientation() }
      />
      <OptionButton
          icon="md-notifications"
          label="Check device orientation"
          onPress={() => checkDeviceOrientation() }
      />
      <OptionButton
          icon="logo-google"
          label="Speech mode"
          onPress={() => speak() }
      />
      <OptionButton
          icon="md-rocket"
          label="Task manager modes"
          onPress={() => taskManagerDetails() }
      />
    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

function speak() {
    var thingToSay = "Hello, i'm the app";
    Speech.speak(thingToSay, { language: "en-US"});
}

function taskManagerDetails() {
  TaskManager.getRegisteredTasksAsync().then(data => {
    console.log(data)
  })
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function changeAppOrientation() {
  ScreenOrientation.getOrientationAsync().then(data => {
    console.log(data.orientation)
    if(data.orientation == ScreenOrientation.Orientation.PORTRAIT_UP) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }
  })
}

function checkDeviceOrientation() {
  ScreenOrientation.getPlatformOrientationLockAsync().then(data => {
    console.log(data)
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
