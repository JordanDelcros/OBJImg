"use strict";

import FileLoader, {FileType} from "./components/FileLoader.js";
import MeshGenerator from "./components/MeshGenerator.js";
import ImageGenerator from "./components/ImageGenerator.js";

import ParseImage from "./methods/ParseImage.js";
import ParseOBJ from "./methods/ParseOBJ.js";
import ParseJSON from "./methods/ParseJSON.js";

export var THREE = null;

export default class OBJImage {
	constructor( path, options ){

		return this.initialize(path, options);

	}
	initialize( path, options ){

		new FileLoader(path)
			.then(( file )=>{

				if( options.onLoad instanceof Function ){

					options.onLoad(file);

				};

				if( file.type == FileType.image ){

					ParseImage(file.data, file.basePath, ()=>{

						

					});

				}
				else if( file.type == FileType.obj ){

					ParseOBJ(file.data, file.basePath, ( modelLibrary )=>{

						if( options.onParse instanceof Function ){

							options.onParse(modelLibrary);

						};

					});

				}
				else if( file.type == FileType.mtl ){



				}
				else if( file.type == FileType.json ){

					ParseJSON(file.data, file.basePath, ()=>{



					});

				};

			})
			.catch(( error )=>{

				throw error;

			});

		return this;

	}
}

OBJImage.version = "2.0.0";

OBJImage.defineTHREE = ( THREELibrary )=>{

	THREE = THREELibrary;

};

OBJImage.MeshGenerator = MeshGenerator;

OBJImage.ImageGenerator = ImageGenerator;

if( typeof define !== "undefined" && define instanceof Function && define.amd !== undefined ){

	define(function(){

		return OBJImage;

	});

}
else if( typeof module !== "undefined" && module.exports ){

	module.exports = OBJImage;

}
else if( typeof self !== "undefined" ){

	self.OBJImage = OBJImage;

};