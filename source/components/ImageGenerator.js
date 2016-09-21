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

		this.compressionType = COMPRESSION.default;

		return this.initialize();

	}
	initialize(){

		console.log("IMAGE GENERATOR");

		this.addPixel(OBJImage.version.major, OBJImage.version.minor, OBJImage.version.patch, 1);

		this.addPixel(this.compressionType);

		this.verticesMultiplicator = this.addPixel(Math.floor(SIZES.max / Math.max(this.modelLibrary.bounds.getMax() + Math.abs(this.modelLibrary.bounds.getMin()), 1)));

		this.verticesLength = this.addPixel(this.modelLibrary.vertices.length);

		this.verticesPivot = this.addPixel(Math.abs(this.modelLibrary.bounds.getMin()) * this.verticesMultiplicator) / this.verticesMultiplicator;

		for( let vertex of this.modelLibrary.vertices ){

			this.addPixel((vertex.x + this.verticesPivot) * this.verticesMultiplicator);
			this.addPixel((vertex.y + this.verticesPivot) * this.verticesMultiplicator);
			this.addPixel((vertex.z + this.verticesPivot) * this.verticesMultiplicator);

		};

		var normalsMultiplicator = Math.floor(SIZES.max / 2);

		this.normalsLength = this.addPixel(this.modelLibrary.normals.length);

		for( let normal of this.modelLibrary.normals ){

			this.addPixel((normal.x + 1) * normalsMultiplicator);
			this.addPixel((normal.y + 1) * normalsMultiplicator);
			this.addPixel((normal.z + 1) * normalsMultiplicator);

		};

		this.texturesLength = this.addPixel(this.modelLibrary.textures.length);

		for( let texture of this.modelLibrary.textures ){

			this.addPixel(texture.u * SIZES.max);
			this.addPixel(texture.v * SIZES.max);

		};

		console.log(this.pixels);

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		var image = new Image();

		image.src = canvas.toDataURL();

		return image;

	}
	addPixel( red = null, green = null, blue = null, alpha = null ){

		if( green === null && blue === null && alpha === null ){

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