import { RequestError } from "../../app/model/exception/RequestError";
import { ConnectionError } from "../../app/model/exception/ConnectionError";
import { Film } from "../../app/model/Film";
import { Character } from "../../app/model/Character";
import { People } from '../../app/model/People';

export class ApiManager {

    // CUSTOM CODES
    NO_INTERNET: number = 101;
    CANNOT_RETRIEVE: number = 201;
    REQUEST_YIELDED_NO_DATA_FOUND: number = 401;
    DATA_EMPTY: number = 1000;

    baseUrl: string = 'https://swapi.co/';

    constructor() { }

    /**
     * Gets files from the API and returns a promise.
     * @param endpoint - The endpoint url. i.e "api/films/?format=json"
     * @returns {Promise<T>} - Promise that can contain anything (i.e Array list or Promise reject).
     */
    async getFilms( endpoint: string ) : Promise<any> {
        return new Promise( ( resolve, reject ) => {
            this.hasInternet( async ( hasInternet: boolean ) => {
                if( hasInternet ) {
                    try {
                        let promise = await fetch( this.buildEndpointUrl( endpoint ) )
                        let data    = await promise.json();

                        if( data != null && typeof data != 'undefined' && typeof data.results != 'undefined' ) {
                            let films   = [];

                            /** Build and add Film objects to a list **/
                            var key = 0;
                            data.results.forEach( film => {
                                key++;
                                var image   = film.title.toLowerCase();
                                image       = image.split(' ').join('_');

                                let item    = new Film(
                                    film.title,
                                    film.created,
                                    film.url,
                                    film.episode_id,
                                    film.opening_crawl,
                                    film.director,
                                    film.producer,
                                    film.release_date,
                                    film.characters,
                                    image
                                );

                                item.selected   = false;
                                item.key        = key;
                                films.push( item );
                            });

                            // By default
                            films[0].selected = true;

                            return resolve( films );

                        }  else return reject( this.getError( this.CANNOT_RETRIEVE ) ); // Reject here. There is no data
                    } catch( error ) {
                        return reject( this.getError() );
                    }
                } else return reject( this.getError(this.NO_INTERNET) );
            });
        });
    }


    /**
     * Gets the characters from the API. This should be used in a paginated fashion
     * @param endpoint - The endpoint url. i.e "api/people/?page=1"
     * @param page - The page number to retrieve characters from
     * @returns {Promise<T>} - Promise that can contain anything (i.e Array list or Promise reject).
     */
    async getPeople( endpoint: string , page: number = 1 ) : Promise<any> {
        return new Promise( ( resolve, reject ) => {
            this.hasInternet( async ( hasInternet: boolean ) => {
                if( hasInternet ) {
                    try {
                        let promise = await fetch( this.buildEndpointUrl( endpoint + '/?page=' + page ) )
                        let data    = await promise.json();

                        if( data != null && typeof data != 'undefined' && typeof data.results != 'undefined' ) {
                            let people  = new People(
                                data.count
                            );

                            let characters  = new Array();
                            data.results.forEach( character => {
                                characters.push(
                                    new Character(
                                        character.name,
                                        character.created,
                                        character.url
                                    )
                                );
                            });

                            people.characters = characters;

                            return resolve( people );

                        }  else return reject( this.getError( this.CANNOT_RETRIEVE ) ); // Reject here. There is no data
                    } catch( error ) {
                        console.log( error )
                        return reject( this.getError() );
                    }
                } else return reject( this.getError(this.NO_INTERNET) );
            });
        });
    }


    /**
     * ---------------------------------------------------------------------
     *           AUXILIARY FUNCTIONS AFTER THIS COMMENT BLOCK
     *               To be shared by multiple functions
     * ---------------------------------------------------------------------
     */

    getError( code?: number, extraMessage?: string, extraErrors?: null ) {
        switch ( code ) {
            case this.DATA_EMPTY:
                return new Error( 'Cannot submit empty information.' );
            case this.REQUEST_YIELDED_NO_DATA_FOUND:
                return new RequestError( extraMessage, extraErrors, this.REQUEST_YIELDED_NO_DATA_FOUND );
            case this.CANNOT_RETRIEVE:
                return new Error( 'Cannot retrieve any data at the moment. Please try again later' );
            case this.NO_INTERNET:
                return new ConnectionError( 'Sorry, but its either your device has no internet access or has lost connectivity recently.' );
            default:
                return new Error( 'Unexpected error occured. Please try again later.' );
        }
    }

    buildEndpointUrl( endpoint: string ) {
        return this.baseUrl + endpoint;
    }

    hasInternet( callback ) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
            callback( true );
        }
        xmlhttp.onerror = function() {
            callback( false );
        }
        xmlhttp.open( 'GET', 'https://swapi.co/api/films/', true );
        xmlhttp.send();
    }
}