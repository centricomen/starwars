import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar, Text, Animated } from 'react-native';
import { Fonts } from '../util/Fonts';
import { ApiManager } from '../http/ApiManager';
//import { Error } from '../model/exception/';
import { NavigationActions, StackActions } from 'react-navigation';

const deviceHeight = Dimensions.get( 'window' ).height;
export default class DataLoadingScreen extends Component {

    currentPeopleIndex: number;
    totalPeoplePages: number;
    peoplePerPage: number = 10; // 10 items retrieved based on the API
    incrementProgressBarBy: number;
    apiManager: any; // Instance of the HTTP provider / service

    films: [];
    people: [];

    constructor() {
        super();
        this.state  = {
            beat    : new Animated.Value(0),
            scale   : null,
            progress: 0
        }

        this.currentPeopleIndex = 1;
        this.totalPeoplePages   = 0;
        this.incrementProgressBarBy = 0;
        this.people      = null;
        this.state.scale = this.state.beat.interpolate({
            inputRange  : [0, 1],
            outputRange : [5, 1]
        });


        this.apiManager = new ApiManager();
        this.fetchFilms();
    }


    static navigationOptions = {
        header: null
    };


    runLoadingAnimation() {
        Animated.sequence([
            Animated.spring( this.state.beat, {
                toValue: 1,
                duration: 2000,
                delay: 100
            }),
            Animated.spring( this.state.beat, {
                toValue: 0,
                duration: 2000
            })

        ]).start(() => {
            this.runLoadingAnimation();
        });
    }


    /**
     * LIFECYCLE FUNCTION
     * When this component has been mounted, begin background fetches
     */
    componentDidMount() {

        Animated.spring( this.state.beat, {
            toValue: 1,
            duration: 4000
        }).start(() => {
            this.state.scale = this.state.beat.interpolate({
                inputRange  : [0, 1],
                outputRange : [1.1, 1]
            });

            // Run this animation after the initial one
            // this.runLoadingAnimation();
        });

    }


    async fetchFilms() {
        try {
            /** getFilms(...) returns a collection of Film objects or a promise rejection **/
            let filmsFromApi = await this.apiManager.getFilms( 'api/films' );
            if( ! ( filmsFromApi instanceof Error ) ) {
                this.films  = this.sortFilmsByReleaseDate( filmsFromApi );
                this.setState({
                    progress:   this.state.progress + 50
                });

                /**
                 * This is the second step. Loading people. They are paginated so we'll
                 * have to come up with a simple batch fetch mechanism
                 */
                this.getPeople( 1 );
            }
        } catch( err ) {
            /** Could not fetch films. Abort mission!!! **/
            console.log( err )
        }

    }


    async getPeople( page: number ) {
        try {
            let peopleFromApi = await this.apiManager.getPeople( 'api/people', page );

            if( ! ( peopleFromApi instanceof Error ) ) {
                if( this.people == null ) {
                    this.people = peopleFromApi;
                    this.calculateTotalPeoplePages( peopleFromApi.count );

                    /**
                     * Each fetch will fill the progress bar. This is calculated by dividing
                     * 50% (the remaining progress) with the number pages
                     */
                    this.incrementProgressBarBy = 50 / this.totalPeoplePages;
                } else {
                    this.people.characters = this.people.characters.concat( peopleFromApi.characters );
                }

                // console.log( this.people );

            } else throw peopleFromApi; // Pass the error along. Could be a RequestError or ConnectionError
        } catch ( error ) {
            console.log( error );
        } finally {

            this.setState({
                progress: this.state.progress + this.incrementProgressBarBy
            });

            this.currentPeopleIndex++;
            if( this.currentPeopleIndex <= this.totalPeoplePages ) {
                // Get more people from the API
                this.getPeople( this.currentPeopleIndex );
            } else {

                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: 'HomeScreen',
                            params: {
                                films   : this.films,
                                people  : this.people
                            }
                        })
                    ]
                });

                // Done loading all people. Navigate to the main screen
                this.props.navigation.dispatch( resetAction );
            }
        }
    }


    calculateTotalPeoplePages( count: number ) {
        if( count % this.peoplePerPage == 0 )
            this.totalPeoplePages = count / this.peoplePerPage;
        else this.totalPeoplePages = Math.floor( count / this.peoplePerPage ) + 1;
    }

    sortFilmsByReleaseDate( filmList: [] ) {
        return filmList.sort(( a, b ) => {
            if(a.releaseDate < b.releaseDate) return -1;
            if(a.releaseDate > b.releaseDate) return 1;

            return 0;
        });
    }

    render() {

        let scale = { scale: this.state.scale };
        let transform = [ scale ];

        return (

            <View style={ styles.container }>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content" />


                <Animated.Image style={[ { transform } ]} source={ require( '../images/logo.png' ) } />
                <Text style={ styles.headerText }>Preparing your data</Text>
                <Text style={ styles.subText }>We are fetching films. Please wait...</Text>

                {/* # START # Progress bar. The easy cross-platform version */}
                <View style={ styles.progressBarContainer }>
                    <View style={[ styles.progressBar, { width: this.state.progress + '%' } ]}></View>
                </View>
                {/* # END # Progress bar. The easy cross-platform version */}
            </View>
        );
    }
}


const styles    = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        color: 'white',
        fontFamily: Fonts.OpenSansExtraBold,
        fontSize: 18,
        marginTop: 15
    },
    subText: {
        color: 'white',
        fontFamily: Fonts.OpenSansRegular
    },
    progressBarContainer: {
        backgroundColor: '#444444',
        width: '80%',
        height: 5,
        marginTop: 15
    },
    progressBar: {
        backgroundColor: '#dfb636',
        height: 5
    }
});