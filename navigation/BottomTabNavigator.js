import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import TeamHistory from '../screens/TeamHistory';
import LeagueHistory from '../screens/LeagueHistory';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="TeamHistory"
        component={TeamHistory}
        options={{
          title: 'Team History',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-football" />,
        }}
      />
      <BottomTab.Screen
        name="LeagueHistory"
        component={LeagueHistory}
        options={{
          title: 'League History',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-analytics" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'TeamHistory':
      return 'TeamHistory';
    case 'LeagueHistory':
      return 'LeagueHistory';
  }
}
