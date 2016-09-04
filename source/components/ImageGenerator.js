export const Sizes = {
	max: (255 * 255 + 255)
};

export default class ImageGenerator {
	constructor( modelLibrary ){

		return this.initialize(modelLibrary);

	}
	initialize( modelLibrary ){

		this.pixels = new Array();

		// version
		this.addPixel(2, 0, 0, 0);

		// compression type
		this.addPixel(1, 0, 0, 0);

		// 

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2D");

		var image = new Image();

		image.src = canvas.toDataURL();

		console.log(this.pixels);

		return image;

	}
	addPixel( red = null, green = null, blue = null, alpha = null ){

		if( red != null && green != null && blue != null && alpha != null ){

			this.pixels.push(red, green, blue, alpha);

		}
		else {

			let value = Math.max(0, Math.min(MAX, red)) || 0;

			let g = Math.min(Math.floor(value / 255), 255);
			let r = (g > 0 ? 255 : 0);
			let b = Math.floor(value - (r * g));
			let a = (((r * g) + b) > 0 ? 255 : 0);

			this.pixels.push(r, g, b, a);

		};

		return this;

	}
}