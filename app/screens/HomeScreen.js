import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import MovieList from "../components/MovieList/MovieList";
import MovieDetail from "../components/MovieDetail/MovieDetail";

export default class HomeScreen extends Component {

    films: any;
    people: any;

    constructor() {
        super();

        this.state = {
            currentFilm: null
        };
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        this.films  = this.props.navigation.state.params.films;
        this.people = this.props.navigation.state.params.people;
        this.state.currentFilm = this.films[0];
    }

    updateFilmSelection( film ) {
        this.setState({
            currentFilm: film
        });

        // this.forceUpdate();
    }

    render() {

        return (
            <View style={ styles.container }>

                <View style={ styles.master }>
                    <MovieList triggerFilmSelectionUpdate={ this.updateFilmSelection.bind(this) } films={ this.films } />
                </View>

                <View style={ styles.detail }>
                    <MovieDetail
                        film={ this.state.currentFilm }
                        people={ this.people } />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
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