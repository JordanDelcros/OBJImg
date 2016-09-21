import OBJImage from "../OBJImage.js";
import Dictionary from "./Dictionary.js";

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

		this.addPixel(this.modelLibrary.vertices.length);

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

		this.addPixel(this.modelLibrary.textures.length);

		for( let texture of this.modelLibrary.textures ){

			this.addPixel(texture.u * SIZES.max);
			this.addPixel(texture.v * SIZES.max);

		};

		this.addPixel(this.modelLibrary.faces.length);

		for( let face of this.modelLibrary.faces ){

			this.addPixel(face.normalA);
			this.addPixel(face.normalB);
			this.addPixel(face.normalC);

			this.addPixel(face.textureA);
			this.addPixel(face.textureB);
			this.addPixel(face.textureC);

			this.addPixel(face.vertexA);
			this.addPixel(face.vertexB);
			this.addPixel(face.vertexC);

		};

		this.addPixel(this.modelLibrary.materialLibrary.materials.length);

		for( let material of this.modelLibrary.materialLibrary.materials ){

			let nameDictionary = new Dictionary(material.name);

			this.addPixel(nameDictionary.letters.length);

			for( let letter of nameDictionary.letters ){

				this.addPixel(letter);

			};

			this.addPixel(material.illumination);

			this.addPixel(material.smooth);

			this.addPixel((material.ambient.red * 255), (material.ambient.green * 255), (material.ambient.blue * 255), 1);

			this.addPixel(material.ambient.map == null ? false : true);

			if( material.ambient.map != null ){

				this.addPixel(material.ambient.map == null ? false : true);

				this.addPixel(material.ambient.channel);

				let mapDictionnary = new Dictionary(material.ambient.map);

				this.addPixel(mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(letter);

				};

			};

			this.addPixel((material.diffuse.red * 255), (material.diffuse.green * 255), (material.diffuse.blue * 255), 1);

			this.addPixel(material.diffuse.map == null ? false : true);

			if( material.diffuse.map != null ){

				this.addPixel(material.diffuse.clamp == null ? false : true);

				this.addPixel(material.diffuse.channel);

				let mapDictionnary = new Dictionary(material.diffuse.map);

				this.addPixel(mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(letter);

				};

			};

			this.addPixel((material.bump.red * 255), (material.bump.green * 255), (material.bump.blue * 255), 1);

			this.addPixel(material.bump.map == null ? false : true);

			if( material.bump.map != null ){

				this.addPixel(material.bump.clamp == null ? false : true);

				this.addPixel(material.bump.channel);

				let mapDictionnary = new Dictionary(material.bump.map);

				this.addPixel(mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(letter);

				};

			};

			this.addPixel((material.specular.red * 255), (material.specular.green * 255), (material.specular.blue * 255), 1);

			this.addPixel(material.specular.force * (SIZES.max / 1000));

			this.addPixel(material.specular.map == null ? false : true);

			if( material.specular.map != null ){

				this.addPixel(material.specular.clamp == null ? false : true);

				this.addPixel(material.specular.channel);

				let mapDictionnary = new Dictionary(material.specular.map);

				this.addPixel(mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(letter);

				};

			};

			this.addPixel(material.specularForce.map == null ? false : true);

			if( material.specularForce.map != null ){

				this.addPixel(material.specular.value * SIZES.max);

				this.addPixel(material.specularForce.clamp == null ? false : true);

				this.addPixel(material.specularForce.channel);

				let mapDictionnary = new Dictionary(material.specularForce.map);

				this.addPixel(mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(letter);

				};

			};

			this.addPixel(material.environement.map == null ? false : true);

			if( material.environement.map != null ){

				this.addPixel(material.specular.force * (SIZES.max / 1000));

				this.addPixel(material.environement.clamp == null ? false : true);

				this.addPixel(material.environement.channel);

				let mapDictionnary = new Dictionary(material.environement.map);

				this.addPixel(mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(letter);

				};

			};

			this.addPixel(material.specular.value * SIZES.max);

			this.addPixel(material.opacity.map == null ? false : true);

			if( material.opacity.map != null ){

				this.addPixel(material.opacity.clamp == null ? false : true);

				this.addPixel(material.opacity.channel);

				let mapDictionnary = new Dictionary(material.opacity.map);

				this.addPixel(mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(letter);

				};

			};

		};

		this.addPixel(this.modelLibrary.objects.length);

		for( let object of this.modelLibrary.objects ){

			let objectDictionary = new Dictionary(object.name);

			this.addPixel(objectDictionary.letters.length);

			for( let letter of objectDictionary.letters ){

				this.addPixel(letter);

			};

			this.addPixel(object.groups.length);

			for( let group of object.groups ){

				let groupDictionary = new Dictionary(group.name);

				this.addPixel(groupDictionary.letters.length);

				for( let letter of groupDictionary.letters ){

					this.addPixel(letter);

				};

				this.addPixel(group.vertices.length);

				let previousVertex = null;
				let vertexFastPass = false;

				for( let vertex of group.vertices ){

					if( vertexFastPass == true ){

						if( (previousVertex + 1) != vertex ){

							vertexFastPass = false;

							this.addPixel(vertex);

						};

					}
					else if( vertexFastPass == false ){

						if( previousVertex != null && (previousVertex + 1) == vertex ){

							vertexFastPass = true;

							this.addPixel(0);

						}
						else {

							this.addPixel(vertex);

						};

					};

					previousVertex = vertex;

				};

				let previousNormal = null;
				let normalFastPass = false;

				for( let normal of group.normals ){

					if( normalFastPass == true ){

						if( (previousNormal + 1) != normal ){

							normalFastPass = false;

							this.addPixel(normal);

						};

					}
					else if( normalFastPass == false ){

						if( previousNormal != null && (previousNormal + 1) == normal ){

							normalFastPass = true;

							this.addPixel(0);

						}
						else {

							this.addPixel(normal);

						};

					};

					previousNormal = normal;

				};

				let previousTexture = null;
				let textureFastPass = false;

				for( let texture of group.textures ){

					if( textureFastPass == true ){

						if( (previousTexture + 1) != texture ){

							textureFastPass = false;

							this.addPixel(texture);

						};

					}
					else if( textureFastPass == false ){

						if( previousTexture != null && (previousTexture + 1) == texture ){

							textureFastPass = true;

							this.addPixel(0);

						}
						else {

							this.addPixel(texture);

						};

					};

					previousTexture = texture;

				};

				let previousFace = null;
				let faceFastPass = false;

				for( let face of group.faces ){

					if( faceFastPass == true ){

						if( (previousFace + 1) != face ){

							faceFastPass = false;

							this.addPixel(face);

						};

					}
					else if( faceFastPass == false ){

						if( previousFace != null && (previousFace + 1) == face ){

							faceFastPass = true;

							this.addPixel(0);

						}
						else {

							this.addPixel(face);

						};

					};

					previousFace = face;

				};

			};

		};

		var square = Math.ceil(Math.sqrt(this.pixels.length / 4)); 

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		canvas.width = canvas.height = square;

		var imageData = context.getImageData(0, 0, square, square);

		for( let pixelData = 0, pixelsDataLength = this.pixels.length; pixelData < pixelsDataLength; pixelData++ ){

			imageData.data[pixelData] = this.pixels[pixelData];

		};

		context.putImageData(imageData, 0, 0);

		var image = new Image();

		image.src = canvas.toDataURL();

		return image;

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