"use strict";

import FileLoader, {FileType} from "./components/FileLoader.js";
import ParseImage from "./methods/ParseImage.js";
import ParseOBJ from "./methods/ParseOBJ.js";
import ParseJSON from "./methods/ParseJSON.js";

export default class OBJImage {
	constructor( path, options ){

		return this.initialize(path, options);

	}
	initialize( path, options ){

		this.file = new FileLoader(path, ( fileData, type, path )=>{

			var basePath = this.file.getBasePath();

			if( type == FileType.IMAGE ){

				ParseImage(fileData, basePath, ()=>{

					

				});

			}
			else if( type == FileType.OBJ ){

				ParseOBJ(fileData, basePath, ()=>{



				});

			}
			else if( type == FileType.MTL ){



			}
			else if( type == FileType.JSON ){

				ParseJSON(fileData, basePath, ()=>{



				});

			};

		}, ( error )=>{

			console.log("NOOOO", error);

		});

		return this;

	}
}

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