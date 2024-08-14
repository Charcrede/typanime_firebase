export class Citations {
    id !: string;
    persoName !: string;
    animeName !: string;
    url !: string;
    text !: string;
}
export class Synopsis{
    constructor(
        public id: string,
        public anime: string,
        public url: string,
        public texte: string,
        public validate: boolean,
    ){}
}