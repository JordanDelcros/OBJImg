import OBJImage from "../OBJImage.js";

export const MAX = (255 * 255 + 255);

export const COMPRESSION = {
	default: 0
};

export default class ImageGenerator {
	constructor( modelLibrary ){

		return this.initialize(modelLibrary);

	}
	initialize( modelLibrary ){

		console.log("IMAGE GENERATOR");

		this.modelLibrary = modelLibrary;

		this.pixels = new Array();

		this.version = this.setVersion(OBJImage.version);

		this.compressionType = this.setCompressionType(COMPRESSION.default);

		this.verticesMultiplicator = this.addMultiplicator(Math.floor(MAX / Math.max(this.modelLibrary.bounds.getMax() + Math.abs(this.modelLibrary.bounds.getMin()), 1)));

		this.addPixel(this.modelLibrary.vertices.length);

		// vertices pivot
		this.addPixel(this.verticesMultiplicator);

		console.log("vertex multi", this.verticesMultiplicator);

		// vertices
		for( let vertex of modelLibrary.vertices ){

			console.log(vertex.x);
			this.addPixel((vertex.x + Math.abs(this.modelLibrary.bounds.getMin())) * this.verticesMultiplicator);
			// this.addPixel((vertex.y + Math.abs(this.modelLibrary.bounds.getMin())) * this.verticesMultiplicator);
			// this.addPixel((vertex.z + Math.abs(this.modelLibrary.bounds.getMin())) * this.verticesMultiplicator);

		};

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		var image = new Image();

		image.src = canvas.toDataURL();

		console.log(this.pixels);

		return image;

	}
	setVersion( version ){

		version = version.toString().split(/\./g);

		this.setPixel(0, parseInt(version[0]), parseInt(version[1]), parseInt(version[2]), 255);

		return version;

	}
	setCompressionType( type ){

		this.setPixel(1, type, 0, 0, 255);

		return type;

	}
	setPixel( index, red, green, blue, alpha ){

		this.pixels[index * 4 + 0] = red;
		this.pixels[index * 4 + 1] = green;
		this.pixels[index * 4 + 2] = blue;
		this.pixels[index * 4 + 3] = alpha;

		return this;

	}
	addMultiplicator( multiplicator ){

		this.addPixel(multiplicator);

		return multiplicator;

	}
	addPixel( red = null, green = null, blue = null, alpha = null ){

		if( red != null && green != null && blue != null && alpha != null ){

			this.pixels.push(red, green, blue, alpha);

		}
		else {

			let value = Math.max(0, Math.min(MAX, red));

			let split = Math.max(1, Math.ceil(value / MAX));

			console.log(split)

			let g = Math.min(Math.floor((value / split) / 255), 255);
			let r = (g > 0 ? 255 : 0);
			let b = Math.floor((value / split) - (r * g));
			let a = split;

			// let r = null;
			// let g = null;
			// let b = null;
			// let a = null;

			// if( value <= 255 ){

			// 	r = 1;
			// 	g = 1;
			// 	b = 1;
			// 	a = value;
			
			// }
			// else if( value <= (255 * 255) ){

			// 	r = 1;
			// 	g = Math.min(Math.floor(value / 255), 255);
			// 	b = 255;
			// 	a = Math.max(0, Math.min(Math.floor(value - (r * g * b)), 255));

			// }
			// else if( value <= (255 * 255 * 255) ){

			// 	console.log("HIGH")

			// 	r = Math.min(Math.floor(value / 255 / 255), 255);
			// 	g = 255;
			// 	b = 255;
			// 	a = Math.max(0, Math.min(Math.floor(value - (r * g * b)), 255));

			// }
			// else {

			// 	r = 255;
			// 	g = 255;
			// 	b = 255;
			// 	a = Math.max(0, Math.min(Math.floor(value - (r * g * b)), 255));

			// };

			console.log(r,g,b,a);
			console.log( (((r*g+b)*a) / this.verticesMultiplicator).toFixed(6) );
			console.log("");

			this.pixels.push(r, g, b, a);

		};

		return this;

	}
}