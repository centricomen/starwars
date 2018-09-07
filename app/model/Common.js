
export class Common {

    name    : string;
    created : Date;
    url     : string;

    constructor(
        name: string,
        created: string,
        url: string
    ) {

        this.name       = name;
        this.url        = url;
        this.created    = new Date( created );

    }

}