import React, { Component } from 'react';
import { Text, TextInput, ListView, View, Image, AppRegistry, StyleSheet, TouchableNativeFeedback } from 'react-native';

import { Fonts } from '../../../app/util/Fonts';
import { ApiManager } from '../../../app/http/ApiManager';
import { Film } from '../../../app/model/Film';

/**
 * MovieList is the movie listing component situated on the left-hand side
 * of the device. It's primary purpose is to serve as the master view
 */
export default class MovieList extends Component {

    constructor() {
        super();

        this.state = {
            dataSource      : null,
            films           : [],
            searchList      : [],
            selectedIndex   : -1,
            searchTerm      : ''
        };
    }

    componentWillMount() {

        this.state.films  = this.props.films;
        this.refreshDataSource( this.state.films );

    }

    renderRow( film: Film, sectionId: number, rowId: number ) {
        this.state.rowIndex += 1;
        /*let url = '../../../app/images/' + film.image;
        const image = require( url );*/

        return (
            <TouchableNativeFeedback
                onPress={ () => this.onRowSelect( film ) }
                key={ film.key }>

                <View style={ film.selected ? rowStyles.rowSelected : rowStyles.row }>
                    <Image style={ rowStyles.poster } source={{ uri: film.image }} />
                    <View style={ rowStyles.content }>

                        <Text style={ rowStyles.boldText }>Star Wars: { film.name }</Text>

                        <Text style={ rowStyles.whiteText }>
                            Released: <Text style={ rowStyles.boldText }>{ film.releaseDate.getFullYear() }</Text>
                        </Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }

    onRowSelect( data: Film ) {

        // Remove selection of previous
        let currentSelection    = this.state.films.filter( ( item ) => item.selected == true );
        if( currentSelection != null ) {
            currentSelection.forEach( item => {
                item.selected = false;
            });
        }

        // Make selection of this one
        data.selected = true;

        /** This is defined in HomeScreen (the parent). Changes the state there which is tied to
         * a MovieDetail prop
         */
        this.props.triggerFilmSelectionUpdate( data );

        // Refresh the data source
        this.refreshDataSource( this.state.searchTerm == '' ? this.state.films : this.state.searchList );

    }

    onInputChange( text ) {
        this.setState({ searchTerm: text });

        let searchList  = this.state.films.filter( ( film: Film ) => {
            return film.name.toLowerCase().indexOf( text.trim().toLowerCase() ) >= 0;
        });

        if( text != '' ) {
            this.setState({
                searchList: searchList
            });

            this.refreshDataSource( this.state.searchList );
        } else this.refreshDataSource( this.state.films );
    }

    refreshDataSource( films: [] ) {
        // Refresh the data source
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows( films )
        });
    }

    render() {
        return (
            <View style={ styles.container }>

                {/* # START # Custom Toolbar */}
                <View style={ styles.toolbar }>
                    <Image
                        style={ styles.logo }
                        source={ require( '../../../app/images/logo.png' ) } />
                </View>
                {/* # END # Custom Toolbar */}


                {/* # START # Search Input */}
                <View style={ styles.fullWidthSpaceLeft }>
                    <View style={ styles.searchContainer }>

                        <TextInput
                            style={ styles.searchInput }
                            underlineColorAndroid="transparent"
                            onChangeText={ (text) => this.onInputChange( text ) }
                            value={ this.state.searchTerm }
                            placeholder="SEARCH FILM"
                            placeholderTextColor="#ffffff" />

                        <Image style={ styles.searchInputIcon } source={ require( '../../../app/images/sprit-1.png' ) } />
                    </View>
                </View>
                {/* # END # Search Input */}


                {
                    this.state.searchTerm == '' || ( this.state.searchTerm != '' && this.state.searchList.length > 0 ) ?
                        <ListView
                            style={ styles.listView }
                            dataSource={ this.state.dataSource }
                            enableEmptySections={true}
                            renderRow={ this.renderRow.bind( this ) }
                            renderHeader={() => {
                                return(
                                    <View style={ styles.subTitleContainer }>
                                        <Image style={ styles.subTitleImage } source={ require( '../../../app/images/film.png' ) } />
                                        <View>
                                            <Text style={ styles.subTitle }>{ this.state.dataSource.getRowCount() } FILMS</Text>
                                            <Text style={ styles.subTitleSmall } >May the force be with you</Text>
                                        </View>

                                    </View>
                                )
                            }} />
                    :
                        <View style={{ width: '100%', paddingLeft: 15, paddingTop: 20 }}>
                            <Text style={{ width: '100%', color: 'white' }}>No results matching "{ this.state.searchTerm }"</Text>
                        </View>
                }

            </View>
        );
    }

}

const rowStyles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        borderBottomColor: '#111111',
        borderBottomWidth: 1
    },
    rowSelected: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#dfb636'
    },
    whiteText: {
        fontSize: 18,
        color: 'white'
    },
    viewMore: {
        marginTop: 15,
        fontSize: 11,
        fontFamily: Fonts.OpenSansExtraBold,
        color: 'white'
    },
    boldText: {
        fontSize: 18,
        marginBottom: 15,
        color: 'white',
        fontFamily: Fonts.OpenSansExtraBold
    },
    poster: {
        /*flex: 1,*/
        height: 130,
        width: 100,
        resizeMode: 'center'
    },
    content: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15
    }
});

const styles    = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        width: '100%'
    },
    whiteText: {
        color: 'white'
    },
    toolbar: {
        paddingTop: 15,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#333333',
        borderBottomWidth: 1,
        height: 'auto',
        width: '100%'
    },
    searchContainer: {
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        borderColor: '#555555',
        borderWidth: 2
    },
    searchInput: {
        backgroundColor: 'transparent',
        paddingLeft: 15,
        color: 'white',
        width: '100%',
        fontFamily: Fonts.OpenSansExtraBold,
        flex: 1
    },
    searchInputIcon: {
        marginTop: 5,
        width: 35,
        height: 35,
        resizeMode: 'stretch'
    },
    fullWidthSpaceLeft: {
        paddingLeft: 15,
        width: '100%'
    },
    subTitleContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 15,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15
    },
    subTitle: {
        color: 'white',
        fontFamily: Fonts.OpenSansBold,
        fontSize: 14
    },
    subTitleSmall: {
        color: 'white',
        fontSize: 12
    },
    subTitleImage: {
        width: 18,
        height: 18,
        resizeMode: 'stretch',
        marginRight: 10
    },
    listView: {
        flex: 1,
        paddingTop: 15,
        paddingLeft: 15
    },
    menuToggle: {
        width: 26,
        height: 26,
        marginRight: 20
    },
    logo: {
        width: 100,
        height: 60
    }
});

AppRegistry.registerComponent( 'MovieList', () => MovieList );