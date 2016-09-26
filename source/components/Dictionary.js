export const LetterLibrary = "/\\abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@-_—,.#0123456789";

export default class Dictionary {
	constructor( source ){

		return this.initialize(source);

	}
	initialize( source ){

		this.letters = new Array();

		this.add(source);

		return this;

	}
	add( elements ){

		if( typeof elements == "string" ){

			for( let letter of elements ){

				this.letters.push(LetterLibrary.indexOf(letter));

			};

		}
		else if( typeof elements == "number" ){

			this.letters.push(elements);

		}
		else if( elements instanceof Array ){

			this.letters.push(...elements.slice(0));

		};

		return this;

	}
	toString(){

		var string = "";

		for( let letter of this.letters ){

			string += LetterLibrary[letter];

		};

		return string;

	}
}