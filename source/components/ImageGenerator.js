import OBJImage from "../OBJImage.js";

export const SIZES = {
	high: (255 * 255 + 255),
	max: (255 * 255 * 255 + 255)
};

export const COMPRESSION = {
	default: 0
};

export default class ImageGenerator {
	constructor( modelLibrary ){

		this.pixels = new Array();

		this.modelLibrary = modelLibrary;

		this.version = OBJImage.version;

		this.compressionType = COMPRESSION.default;

		return this.initialize();

	}
	initialize(){

		console.log("IMAGE GENERATOR");

		this.setVersion(this.version);

		this.setCompressionType(this.compressionType);

		this.verticesMultiplicator = this.addPixel(Math.floor(SIZES.max / Math.max(this.modelLibrary.bounds.getMax() + Math.abs(this.modelLibrary.bounds.getMin()), 1)));

		this.verticesLength = this.addPixel(this.modelLibrary.vertices.length);

		this.verticesPivot = this.addPixel(Math.abs(this.modelLibrary.bounds.getMin()) * this.verticesMultiplicator) / this.verticesMultiplicator;

		for( let vertex of this.modelLibrary.vertices ){

			this.addPixel((vertex.x + this.verticesPivot) * this.verticesMultiplicator);
			this.addPixel((vertex.y + this.verticesPivot) * this.verticesMultiplicator);
			this.addPixel((vertex.z + this.verticesPivot) * this.verticesMultiplicator);

		};

		// STOPED HERE
		this.normalsMultiplicator = this.addPixel();

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		var image = new Image();

		image.src = canvas.toDataURL();

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
	addPixel( red = null, green = null, blue = null, alpha = null ){

		if( green == null && blue == null && alpha == null ){

			let value = Math.max(0, Math.min(SIZES.max, red));

			let split = Math.max(1, Math.ceil(value / SIZES.high));

			green = Math.min(Math.floor((value / split) / 255), 255);
			red = (green > 0 ? 255 : 0);
			blue = Math.floor((value / split) - (red * green));
			alpha = split;

		};

		this.pixels.push(red, green, blue, alpha);

		return (red * green + blue) * alpha;

	}
}