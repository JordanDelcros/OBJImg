"use strict";

import FileLoader from "./components/FileLoader.js";

export default class OBJImage {
	constructor( path ){

		return this.initialize(path);

	}
	initialize( path ){

		this.file = new FileLoader(path);

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