export const FileType = {
	IMAGE: 0,
	OBJ: 1,
	MTL: 2,
	JSON: 3,
	TEXT: 4
};

export default class FileLoader {
	constructor( path, onComplete, onFail ){

		return this.initialize(path, onComplete, onFail);

	}
	initialize( path, onComplete, onFail ){

		this.path = path;

		if( /\.(png|jpe?g|gif|bmp)$/.test(this.path) ){

			this.type = FileType.IMAGE;

			this.content = FileLoader.loadImage.call(this, this.path, onComplete, onFail);

		}
		else if( /\.obj$/g.test(this.path) ){

			this.type = FileType.OBJ;

			this.content = FileLoader.loadText.call(this, this.path, onComplete, onFail);

		}
		else if( /\.mtl$/g.test(this.path) ){

			this.type = FileType.MTL;

			this.content = FileLoader.loadText.call(this, this.path, onComplete, onFail);

		}
		else if( /\.json$/g.test(this.path) ){

			this.type = FileType.JSON;

			this.content = FileLoader.loadText.call(this, this.path, ( data, type )=>{

				onComplete(JSON.parse(data), type);

			}, onFail);

		};

		return this;

	}
};

FileLoader.loadImage = function FileLoaderLoadImage( path, onComplete, onFail ){

	var image = new Image();

	image.addEventListener("load", ()=>{

		onComplete(image, this.type || FileType.IMAGE);

	}, false);

	image.addEventListener("error", ()=>{

		onFail();

	}, false);

	image.src = path;

	return null;

};

FileLoader.loadText = function FileLoaderLoadText( path, onComplete, onFail ){

	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", ( event )=>{

		if( event.target.readyState == XMLHttpRequest.UNSEND ){

		}
		else if( event.target.readyState == XMLHttpRequest.OPENED ){

		}
		else if( event.target.readyState == XMLHttpRequest.HEADERS_RECEIVED ){
			
		}
		else if( event.target.readyState == XMLHttpRequest.LOADING ){
			
		}
		else if( event.target.readyState == XMLHttpRequest.DONE ){

			if( event.target.status >= 200 && event.target.status < 400 ){

				onComplete(event.target.responseText, this.type || FileType.TEXT);

			}
			else if( event.target.status >= 400 ){

				onFail();

			};

		}

	}, false);

	request.open("GET", path, true);

	request.send(null);

	return null;

};