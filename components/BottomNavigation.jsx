import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Search from '../screens/Search';
import Friends from '../screens/Friends';
import Drafts from '../screens/Drafts';
import Settings from '../screens/Settings';
import Login from '../screens/Login';
import NavigationIcon from './NavigationIcon';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
    return (
        <Tab.Navigator
            initialRouteName="Login"
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
                name="login"
                component={Login}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tab.Screen
                name="Home"
                component={Home}
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
                component={Search}
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
                component={Friends}
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
                component={Drafts}
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
                component={Settings}
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
