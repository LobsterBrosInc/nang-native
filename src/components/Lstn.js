import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import DrawerContent from './DrawerContent'
import MainMenu from './MainMenu'
import LoginView from './LoginView'
import Player from './Player'
import LstnToHomie from './LstnToHomie'
import HomieListView from './HomieListView'
import TrackListView from './TrackListView'
import PlaylistListView from './PlaylistListView'
import SearchView from './SearchView'

import firebase from 'firebase'
import _ from 'lodash'

firebase.initializeApp({
    apiKey: "AIzaSyA5mK55jJHOjgv06fzIM6SvcMOxA-qKU6s",
    authDomain: "lstn-testing.firebaseapp.com",
    databaseURL: "https://lstn-testing.firebaseio.com",
    storageBucket: "lstn-testing.appspot.com"
});

const Drawer = createDrawerNavigator();

export default function Lstn() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="login" drawerPosition="right">
        <Drawer.Screen name="login" component={LoginView} />
        <Drawer.Screen name="player" component={Player} />
        <Drawer.Screen name="homie" component={LstnToHomie} />
        <Drawer.Screen name="homieList" component={HomieListView} />
        <Drawer.Screen name="trackList" component={TrackListView} />
        <Drawer.Screen name="playlistList" component={PlaylistListView} />
        <Drawer.Screen name="searchView" component={SearchView} />
        <Drawer.Screen name="mainMenu" component={MainMenu} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// export default createDrawerNavigator(
//   {
//     login: LoginView,
//     player: Player,
//     homie: LstnToHomie,
//     homieList: HomieListView,
//     trackList: TrackListView,
//     playlistList: PlaylistListView,
//     searchView: SearchView,
//     mainMenu: MainMenu
//   },
//   {
//     initialRouteName: 'login',
//     contentComponent: DrawerContent,
//     drawerPosition: 'right',
//     drawerWidth: 75
//   }
// );