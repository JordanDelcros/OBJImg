export const FileType = {
	image: 0,
	obj: 1,
	mtl: 2,
	json: 3,
	text: 4
};

export default class FileLoader {
	constructor( path ){

		return this.initialize(path);

	}
	initialize( path ){

		if( path instanceof Image ){

			this.skipLoading = true;

			this.type = FileType.image;

			this.path = path.src;

			this.data = path;

		}
		else {

			this.path = path;

			this.basePath = this.path.split(/\//).slice(0, -1).join("/") + "/";

			this.data = null;

			if( /\.(png|jpe?g|gif|bmp)$/.test(this.path) ){

				this.type = FileType.image;

				FileLoader.loadImage.call(this, this.path, ( data, type )=>{

					this.data = data;

					this.completeHandler(this);

				}, this.errorHandler);

			}
			else if( /\.obj$/g.test(this.path) ){

				this.type = FileType.obj;

				FileLoader.loadText.call(this, this.path, ( data, type )=>{

					this.data = data;

					this.completeHandler(this);

				}, this.errorHandler);

			}
			else if( /\.mtl$/g.test(this.path) ){

				this.type = FileType.mtl;

				FileLoader.loadText.call(this, this.path, ( data, type )=>{

					this.data = data;

					this.completeHandler(this);

				}, this.errorHandler);

			}
			else if( /\.json$/g.test(this.path) ){

				this.type = FileType.json;

				FileLoader.loadText.call(this, this.path, ( data, type )=>{

					this.data = JSON.parse(data);

					this.completeHandler(this);

				}, this.errorHandler);

			};

		};

		return this;

	}
	catch( callback ){

		this.errorHandler = callback || function( error ){

			throw error;

		};

		return this;

	}
	then( callback ){

		this.completeHandler = callback || function( file ){

			console.info("OBJImage — FileLoader", file);

		};

		if( this.skipLoading == true ){

			this.completeHandler(this);

		};

		return this;

	}
};

FileLoader.loadImage = function ImageFileLoader( path, onComplete, onFail ){

	var image = new Image();

	image.addEventListener("load", ()=>{

		onComplete(image, (this.type || FileType.image), path);

	}, false);

	image.addEventListener("error", ()=>{

		onFail();

	}, false);

	image.src = path;

	return image;

};

FileLoader.loadText = function TextFileLoader( path, onComplete, onFail ){

	var request = new XMLHttpRequest();

	var text = new String();

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

				text += event.target.responseText;

				onComplete(text, (this.type || FileType.TEXT), path);

			}
			else if( event.target.status >= 400 ){

				onFail();

			};

		}

	}, false);

	request.open("GET", path, true);

	request.send(null);

	return text;

};