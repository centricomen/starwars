import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import DataLoadingScreen from './app/screens/DataLoadingScreen';
import HomeScreen from './app/screens/HomeScreen';

export default class App extends Component {
    render() {
        return (
            <AppNavigator />
        );
    }
}

const AppNavigator = createStackNavigator({
    DataLoadingScreen: DataLoadingScreen,
    HomeScreen: HomeScreen
}, {
    headerMode: 'screen'
});

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'row'
    },
    master: {
        flex: 1,
        height: '100%',
        backgroundColor: 'black'
    },
    detail: {
        flex: 2,
        height: '100%',
        backgroundColor: 'black'
    }
});
