import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home';
import SearchScreen from '../screens/Search';
import FriendsScreen from '../screens/Friends';
import DraftsScreen from '../screens/Drafts';
import SettingsScreen from '../screens/Settings';
import NavigationIcon from './NavigationIcon';

const Tab = createBottomTabNavigator();

export default function Navigation() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 35,
                    left: 20,
                    right: 20,
                    backgroundColor: '#F0F0F0',
                    borderRadius: 15,
                    height: 65,
                    shadowColor: 'black',
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 3,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <NavigationIcon
                            imageWidth={21.11}
                            imageHeight={23}
                            imageSource={require('../assets/icons/png/home.png')}
                            imageFocus={focused}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <NavigationIcon
                            imageWidth={23.41}
                            imageHeight={23}
                            imageSource={require('../assets/icons/png/search.png')}
                            imageFocus={focused}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Friends"
                component={FriendsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <NavigationIcon
                            imageWidth={35.22}
                            imageHeight={23}
                            imageSource={require('../assets/icons/png/friends.png')}
                            imageFocus={focused}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Drafts"
                component={DraftsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <NavigationIcon
                            imageWidth={15.68}
                            imageHeight={23}
                            imageSource={require('../assets/icons/png/drafts.png')}
                            imageFocus={focused}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <NavigationIcon
                            imageWidth={23}
                            imageHeight={23}
                            imageSource={require('../assets/icons/png/settings.png')}
                            imageFocus={focused}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
