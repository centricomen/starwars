
import { Common } from '../model/Common';

export class Film extends Common {

    episode : number;
    openingCrawl    : string;
    director        : string;
    producer        : string;
    releaseDate     : Date;
    characters      : Array;
    image           : string;

    // ui state attributes
    selected        : boolean;
    key             : number;

    constructor(
        name    : string,
        created : string,
        url     : string,
        episode : number,
        openingCrawl    : string,
        director        : string,
        producer        : string,
        releaseDate     : string,
        characters      : [],
        image           : ''
    ) {

        // Initialize through base class
        super( name, created, url );

        this.openingCrawl   = openingCrawl;
        this.director       = director;
        this.producer       = producer;
        this.episode        = episode
        this.releaseDate    = new Date( releaseDate );
        this.characters     = characters;
        this.selected       = false;
        this.image          = image;
        this.key            = 0;

    }

}