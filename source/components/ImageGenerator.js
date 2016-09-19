export const Sizes = {
	max: (255 * 255 * 255)
};

export default class ImageGenerator {
	constructor( modelLibrary ){

		return this.initialize(modelLibrary);

	}
	initialize( modelLibrary ){

		console.log("IMAGE GENERATOR");

		this.pixels = new Array();

		// version
		this.addPixel(2);

		// compression type
		this.addPixel(1);

		// multiplicator
		this.addPixel(66);

		// vertices count
		this.addPixel(modelLibrary.vertices.length);

		// vertices pivot
		var vertexMultiplicator = Math.floor(Sizes.max / Math.max(modelLibrary.bounds.getMax() + Math.abs(modelLibrary.bounds.getMin()), 1));
		this.vm = vertexMultiplicator;
		this.addPixel(vertexMultiplicator);

		console.log("vertex multi", vertexMultiplicator);

		// vertices
		for( let vertex of modelLibrary.vertices ){

			console.log(vertex);

			this.addPixel(vertex.x * vertexMultiplicator);
			this.addPixel(vertex.y * vertexMultiplicator);
			this.addPixel(vertex.z * vertexMultiplicator);

		};

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

			console.log("from", red);

			let value = Math.max(0, Math.min(Sizes.max, red)) || 0;

			let r = 0;
			let g = 0;
			let b = 0;
			let a = 0;

			if( value <= 255 ){

				r = 1;
				g = 1;
				b = value;
				a = 1;

			}
			else if( value <= (255 * 255) ){

				r = 1;
				g = (value / 255);
				b = 255;
				a = 1;

			}
			else {

				r = (value / 255 / 255);
				g = 255;
				b = 255;
				a = 1;

			};

			console.log("RGBA", r, g, b, a)

			console.log("to", r * g * b * a, (r*g*b*a) / this.vm);

			this.pixels.push(r, g, b, a);

			// let g = Math.min(Math.floor(value / 255), 255);
			// let r = (g > 0 ? 255 : 0);
			// let b = Math.floor(value - (r * g));
			// let a = (((r * g) + b) > 0 ? 255 : 0);

			// this.pixels.push(r, g, b, a);

		};

		return this;

	}
}