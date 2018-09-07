import React, { Component } from 'react';
import { Text, View, Image, Button, StyleSheet, AppRegistry, Animated, Dimensions, ScrollView } from 'react-native';

import { Fonts } from '../../../app/util/Fonts';
import renderIf from '../../../app/util/RenderIf';
import { Film } from '../../../app/model/Film';
import { Character } from '../../../app/model/Character';

const deviceHeight = Dimensions.get( 'window' ).height;

export default class MovieDetail extends Component {

    people: any
    film: Film;

    constructor() {
        super();

        this.state  = {
            showCrawl   : false,
            y           : new Animated.Value(deviceHeight)
        }

    }

    componentWillMount() {
        this.people = this.props.people;
        //this.film   = this.props.film;
    }

    componentWillUpdate(nextProps, nextState ) {

        if( this.props.film.name != nextProps.film.name )
            this.hideOpeningCrawl();
    }

    getTextWithRemovedLineBreaks( text: string ) {
        return text.replace( /\r?\n|\r/g, ' ' );
    }

    getFilmCharacters() {
        let characters  = [];

        if( this.props.film != null ) {
            this.props.film.characters.forEach( characterUrl => {
                let found   = this.people.characters.filter( ( character: Character ) => {
                    return character.url == characterUrl
                });

                // Found the character matching the url in the "people" collection
                found.forEach( ( character: Character ) => {
                    characters.push( <Text style={ styles.tag }>{ character.name }</Text> );
                });
            });

        }

        return characters;
    }

    showOpeningCrawl() {

        this.setState({
            showCrawl: true
        });

        Animated.timing(this.state.y, {
            duration: 30000,
            toValue: -(deviceHeight * 2)
        }).start(() => {
            this.hideOpeningCrawl();
        });
    }


    hideOpeningCrawl() {
        this.setState({
            showCrawl: false,
            y : new Animated.Value(deviceHeight)
        });
    }


    render() {
        let characters  = this.getFilmCharacters();
        let showCrawl   = this.showOpeningCrawl.bind( this );
        let hideCrawl   = this.hideOpeningCrawl.bind( this );

        return (

            <ScrollView style={ styles.container }>
                {
                    ! this.state.showCrawl ?
                        <View style={{ width: '100%' }}>
                            <View style={ styles.bannerContainer }>
                                <Image
                                    style={ styles.bannerImage }
                                    source={{ uri: this.props.film.image + '_banner' }}
                                    resizeMode="cover" />

                                <View style={ styles.detailTitleContainer }>
                                    <View style={ styles.detailEmpty }></View>
                                    <View style={ styles.detail }>

                                        <View style={ styles.detailInner }>
                                            <Image style={ styles.detailTitleIcon } source={ require( '../../../app/images/film.png' ) } />
                                            <Text style={[ styles.detailText, styles.detailTextTitle ]}>
                                                Star Wars: { this.props.film.name }
                                            </Text>
                                        </View>

                                        <View style={ styles.detailMoreInfo }>
                                            <Text style={[ styles.detailText ]}>
                                                <Text style={[ styles.detailText, styles.detailTextValue ]}>Director: { this.props.film.director }</Text>
                                            </Text>

                                            <Text style={[ styles.detailText ]}>
                                                <Text style={[ styles.detailText, styles.detailTextValue ]}>Director: { this.props.film.director }</Text>
                                            </Text>

                                            <Button
                                                onPress={ showCrawl }
                                                title="WATCH OPENING CRAWL"
                                                style={ styles.watchOpeningCrawl } />
                                        </View>
                                    </View>
                                </View>
                            </View>


                            <View style={ styles.infoContainer }>

                                {/* # START # Starring */}
                                <View style={ styles.sectionContainer }>
                                    <Text style={ styles.sectionHeader }>Starring</Text>
                                    {/* # START # Tags */}
                                    <View style={ styles.tagContainer }>
                                        { characters }
                                    </View>
                                    {/* # END # Tags */}
                                </View>
                                {/* # END # Starring */}


                                {/* # START # About */}
                                <View style={ styles.sectionContainer }>
                                    <Text style={ styles.sectionHeader }>About</Text>
                                    <Text style={ styles.whiteText }>{ this.getTextWithRemovedLineBreaks( this.props.film.openingCrawl ) }</Text>
                                </View>
                                {/* # END # About */}


                            </View>
                        </View>
                    :
                        <View style={{ height: deviceHeight, width: '100%', backgroundColor: 'black' }}>

                            <View style={{ zIndex: 2, position: 'absolute', right: 20, top: 20 }}>
                                <Button
                                    onPress={ hideCrawl }
                                    title="STOP WATCHING"
                                    style={[ styles.watchOpeningCrawl, { width: '100%' }]} />
                            </View>

                            <View style={{ width: '60%', height: deviceHeight + (deviceHeight / 2), zIndex: 1, top: -(deviceHeight / 2), left: '20%', right: 0, position: 'absolute', transform: [{ perspective: 400 }, { rotateX: '60deg' }] }}>
                                <Animated.Text style={{ color: 'rgb(229, 177, 58)', position: 'absolute', top: this.state.y, textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>
                                    { this.props.film.openingCrawl }
                                </Animated.Text>
                            </View>
                        </View>
                }
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 15,
        paddingBottom: 30
    },
    detailTitleContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    detailEmpty: {
        flex: 1
    },
    detail: {
        height: '100%',
        width: '100%',
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    detailTitleIcon: {
        marginTop: 10
    },
    detailInner: {
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        width: '100%'
    },
    detailMoreInfo: {
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 60,
        paddingRight: 20
    },
    detailText: {
        color: 'white',
        paddingBottom: 10
    },
    detailTextTitle: {
        fontFamily: Fonts.OpenSansExtraBold,
        fontSize: 28,
        marginLeft: 10
    },
    detailTextValue: {
        fontFamily: Fonts.OpenSansBold
    },
    watchOpeningCrawl: {
        backgroundColor: '#0080C0',
        color: 'white',
        fontFamily: Fonts.OpenSansBold
    },
    bannerContainer: {
        flex: 1,
        height: deviceHeight / 2,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    bannerImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'contain',
        opacity: 0.7
    },
    sectionContainer: {
        width: '100%',
        paddingRight: 15
    },
    sectionHeader: {
        color: 'white',
        fontFamily: Fonts.OpenSansExtraBold,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        fontSize: 18
    },
    tagContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 15
    },
    tag: {
        backgroundColor: '#4a00c0',
        color: 'white',
        fontFamily: Fonts.OpenSansBold,
        marginRight: 10,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 50
    },
    infoContainer: {
        flex: 3
    },
    whiteText: {
        color: 'white',
        fontFamily: Fonts.OpenSansRegular
    }
});

AppRegistry.registerComponent( 'MovieDetail', () => MovieDetail );