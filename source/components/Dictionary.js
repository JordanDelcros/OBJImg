export const LetterLibrary = "/\\abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@-—_.#0123456789";

export default class Dictionary {
	constructor( source ){

		return this.initialize(source);

	}
	initialize( source ){

		this.letters = new Array();

		if( typeof source == "string" ){

			for( let letter of source ){

				this.letters.push(LetterLibrary.indexOf(letter));

			};

		}
		else if( source instanceof Array ){

			this.letters = source.slice(0);

		};

		return this;

	}
	toString(){

		var string = "";

		for( let letter of this.letters ){

			string += LetterLibrary[letter];

		};

		return letter;

	}
}