export default class ImageReader {
	constructor( image ){

		return this.initialize(image);

	}
	initialize( image ){

		console.log("IMAGE READER");

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		console.log(image);

		var imageData = context.getImageData(image);

		return this;

	}
}