"use strict";

// import ImageLoader from "components/image-loader.js";

export default class OBJImage {
	constructor( path ){

		return this.initialize(path);

	}
	initialize( path ){

		console.log(path);

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