import { TYPE } from "./Constants.js";

export default class FileLoader {
	constructor( path ){

		return this.initialize(path);

	}
	initialize( path ){

		this.path = path;

		if( /\.(png|jpe?g|gif|bmp)$/.test(this.path) ){

			this.type = TYPE.IMAGE;

			this.content = FileLoader.loadImage(this.path, ( image )=>{

				console.log(image);

			}, ( error )=>{

				console.error(error);

			});

		}
		else if( /\.obj$/g.test(this.path) ){

			this.type = TYPE.OBJ;

			this.content = FileLoader.loadText();

		}
		else if( /\.mtl$/g.test(this.path) ){

			this.type = TYPE.MTL;

			this.content = FileLoader.loadText();

		}
		else if( /\.json$/g.test(this.path) ){

			this.type = TYPE.JSON;

			this.content = FileLoader.loadText(this.path);

		};

		return this;

	}
};

FileLoader.loadImage = function FileLoaderLoadImage( path, onComplete, onFail ){

	console.log("LOAD IMAGE");

	var image = new Image();

	image.addEventListener("load", onComplete.bind(this, image), false);
	image.addEventListener("error", onFail.bind(this), false);

	image.src = path;

	return image;

};

FileLoader.loadText = function FileLoaderLoadText( path, onComplete, onFail ){

	console.log("LOAD TEXT", path);

	var text = new String();

	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", ( event )=>{

		if( event.target.readyState == XMLHttpRequest.UNSED ){

		}
		else if( event.target.readyState == XMLHttpRequest.OPENED ){

		}
		else if( event.target.readyState == XMLHttpRequest.HEADERS_RECEIVED ){
			
		}
		else if( event.target.readyState == XMLHttpRequest.LOADING ){
			
		}
		else if( event.target.readyState == XMLHttpRequest.DONE ){

			if( event.target.status >= 200 && event.target.status < 400 ){

			}
			else if( event.target.status >= 400 ){

			};

		}

	}, false);

	request.open("GET", path, true);

	request.send(null);

	return text;

};