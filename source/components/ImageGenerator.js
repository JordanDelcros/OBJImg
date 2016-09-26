import OBJImage from "../OBJImage.js";
import Dictionary from "./Dictionary.js";

export const Max = (255 * 255 + 255);

export const CompressionType = {
	default: 0
};

export default class ImageGenerator {
	constructor( modelLibrary ){

		this.pixels = new Array();

		this.modelLibrary = modelLibrary;

		this.compressionType = CompressionType.default;

		return this.initialize();

	}
	initialize(){

		this.addPixel(1, OBJImage.version.major, OBJImage.version.minor, OBJImage.version.patch, 255);

		this.addPixel(1, this.compressionType);

		var verticesCountSplitting = Math.ceil(this.modelLibrary.vertices.length / Max);

		var verticesPivot = Math.abs(this.modelLibrary.bounds.getMin());

		var verticesMultiplicator = Math.floor(Max / Math.max(this.modelLibrary.bounds.getMax() + Math.abs(this.modelLibrary.bounds.getMin()), 1));

		this.addPixel(1, verticesMultiplicator);

		this.addPixel(1, (verticesPivot * verticesMultiplicator));

		this.addPixel(1, verticesCountSplitting);

		this.addPixel(verticesCountSplitting, this.modelLibrary.vertices.length);

		for( let vertex of this.modelLibrary.vertices ){

			this.addPixel(1, (vertex.x + verticesPivot) * verticesMultiplicator);
			this.addPixel(1, (vertex.y + verticesPivot) * verticesMultiplicator);
			this.addPixel(1, (vertex.z + verticesPivot) * verticesMultiplicator);

		};

		var normalsMultiplicator = Math.floor(Max / 2);

		var normalsCountSplitting = Math.ceil(this.modelLibrary.normals.length / Max);

		this.addPixel(1, normalsCountSplitting);

		this.addPixel(normalsCountSplitting, this.modelLibrary.normals.length);

		for( let normal of this.modelLibrary.normals ){

			this.addPixel(1, (normal.x + 1) * normalsMultiplicator);
			this.addPixel(1, (normal.y + 1) * normalsMultiplicator);
			this.addPixel(1, (normal.z + 1) * normalsMultiplicator);

		};

		var texturesCountSplitting = Math.ceil(this.modelLibrary.textures.length / Max);

		this.addPixel(1, texturesCountSplitting);

		this.addPixel(texturesCountSplitting, this.modelLibrary.textures.length);

		for( let texture of this.modelLibrary.textures ){

			this.addPixel(1, (texture.u % 1) * Max);
			this.addPixel(1, (texture.v % 1) * Max);

		};

		var facesCountSplitting = Math.ceil(this.modelLibrary.faces.length / Max);

		this.addPixel(1, facesCountSplitting);

		this.addPixel(facesCountSplitting, this.modelLibrary.faces.length);

		for( let face of this.modelLibrary.faces ){

			this.addPixel(verticesCountSplitting, face.vertexA);
			this.addPixel(verticesCountSplitting, face.vertexB);
			this.addPixel(verticesCountSplitting, face.vertexC);

			this.addPixel(normalsCountSplitting, face.normalA);
			this.addPixel(normalsCountSplitting, face.normalB);
			this.addPixel(normalsCountSplitting, face.normalC);

			this.addPixel(texturesCountSplitting, face.textureA);
			this.addPixel(texturesCountSplitting, face.textureB);
			this.addPixel(texturesCountSplitting, face.textureC);

		};

		var materialsCountSplitting = Math.ceil(this.modelLibrary.materialLibrary.materials.length / Max);

		this.addPixel(1, materialsCountSplitting);

		this.addPixel(materialsCountSplitting, this.modelLibrary.materialLibrary.materials.length);

		for( let material of this.modelLibrary.materialLibrary.materials ){

			let nameDictionary = new Dictionary(material.name);

			this.addPixel(1, nameDictionary.letters.length);

			for( let letter of nameDictionary.letters ){

				this.addPixel(1, letter);

			};

			this.addPixel(1, material.illumination);

			this.addPixel(1, material.smooth);

			this.addPixel(1, (material.ambient.red * 255), (material.ambient.green * 255), (material.ambient.blue * 255), 255);

			this.addPixel(1, (material.ambient.map == null ? false : true));

			if( material.ambient.map != null ){

				this.addPixel(1, material.ambient.clamp);

				this.addPixel(1, material.ambient.channel);

				let mapDictionnary = new Dictionary(material.ambient.map);

				this.addPixel(1, mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(1, letter);

				};

			};

			this.addPixel(1, (material.diffuse.red * 255), (material.diffuse.green * 255), (material.diffuse.blue * 255), 255);

			this.addPixel(1, material.diffuse.map == null ? false : true);

			if( material.diffuse.map != null ){

				this.addPixel(1, material.diffuse.clamp);

				this.addPixel(1, material.diffuse.channel);

				let mapDictionnary = new Dictionary(material.diffuse.map);

				this.addPixel(1, mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(1, letter);

				};

			};

			this.addPixel(1, (material.bump.red * 255), (material.bump.green * 255), (material.bump.blue * 255), 255);

			this.addPixel(1, material.bump.map == null ? false : true);

			if( material.bump.map != null ){

				this.addPixel(1, material.bump.clamp == null ? false : true);

				this.addPixel(1, material.bump.channel);

				let mapDictionnary = new Dictionary(material.bump.map);

				this.addPixel(1, mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(1, letter);

				};

			};

			this.addPixel(1, (material.specular.red * 255), (material.specular.green * 255), (material.specular.blue * 255), 255);

			this.addPixel(1, material.specular.force * (Max / 1000));

			this.addPixel(1, material.specular.map == null ? false : true);

			if( material.specular.map != null ){

				this.addPixel(1, material.specular.clamp == null ? false : true);

				this.addPixel(1, material.specular.channel);

				let mapDictionnary = new Dictionary(material.specular.map);

				this.addPixel(1, mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(1, letter);

				};

			};

			this.addPixel(1, material.specularForce.map == null ? false : true);

			if( material.specularForce.map != null ){

				this.addPixel(1, material.specular.value * Max);

				this.addPixel(1, material.specularForce.clamp == null ? false : true);

				this.addPixel(1, material.specularForce.channel);

				let mapDictionnary = new Dictionary(material.specularForce.map);

				this.addPixel(1, mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(1, letter);

				};

			};

			this.addPixel(1, material.environement.map == null ? false : true);

			if( material.environement.map != null ){

				this.addPixel(1, material.specular.force * (Max / 1000));

				this.addPixel(1, material.environement.clamp == null ? false : true);

				this.addPixel(1, material.environement.channel);

				let mapDictionnary = new Dictionary(material.environement.map);

				this.addPixel(1, mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(1, letter);

				};

			};

			this.addPixel(1, material.specular.value * Max);

			this.addPixel(1, material.opacity.map == null ? false : true);

			if( material.opacity.map != null ){

				this.addPixel(1, material.opacity.clamp == null ? false : true);

				this.addPixel(1, material.opacity.channel);

				let mapDictionnary = new Dictionary(material.opacity.map);

				this.addPixel(1, mapDictionnary.letters.length);

				for( let letter of mapDictionnary.letters ){

					this.addPixel(1, letter);

				};

			};

		};

		this.addPixel(1, this.modelLibrary.objects.length);

		for( let object of this.modelLibrary.objects ){

			let objectDictionary = new Dictionary(object.name);

			this.addPixel(1, objectDictionary.letters.length);

			for( let letter of objectDictionary.letters ){

				this.addPixel(1, letter);

			};

			this.addPixel(1, object.groups.length);

			for( let group of object.groups ){

				let groupDictionary = new Dictionary(group.name);

				this.addPixel(1, groupDictionary.letters.length);

				for( let letter of groupDictionary.letters ){

					this.addPixel(1, letter);

				};

				this.addPixel(1, group.vertices.length);

				let previousVertex = null;
				let vertexFastPass = false;

				for( let vertex of group.vertices ){

					if( vertexFastPass == true ){

						if( (previousVertex + 1) != vertex ){

							vertexFastPass = false;

							this.addPixel(1, vertex);

						};

					}
					else if( vertexFastPass == false ){

						if( previousVertex != null && (previousVertex + 1) == vertex ){

							vertexFastPass = true;

							this.addPixel(1, 0);

						}
						else {

							this.addPixel(1, vertex);

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

							this.addPixel(1, normal);

						};

					}
					else if( normalFastPass == false ){

						if( previousNormal != null && (previousNormal + 1) == normal ){

							normalFastPass = true;

							this.addPixel(1, 0);

						}
						else {

							this.addPixel(1, normal);

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

							this.addPixel(1, texture);

						};

					}
					else if( textureFastPass == false ){

						if( previousTexture != null && (previousTexture + 1) == texture ){

							textureFastPass = true;

							this.addPixel(1, 0);

						}
						else {

							this.addPixel(1, texture);

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

							this.addPixel(1, face);

						};

					}
					else if( faceFastPass == false ){

						if( previousFace != null && (previousFace + 1) == face ){

							faceFastPass = true;

							this.addPixel(1, 0);

						}
						else {

							this.addPixel(1, face);

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

		var imageData = new ImageData(square, square);

		imageData.data.set(this.pixels);

		window.generated = imageData.data;
		
		context.putImageData(imageData, 0, 0);

		var image = new Image();

		image.width = image.height = square;

		image.src = canvas.toDataURL("image/png");

		return image;

	}
	addPixel( splitting = 1, red = null, green = null, blue = null, alpha = null ){

		if( red != null && green != null && blue != null && alpha != null ){

			this.pixels.push(red, green, blue, alpha);

		}
		else if( red != null && green == null && blue == null ){

			if( this.compressionType == CompressionType.default ){

				let value = red;

				// let splitting = Math.max(1, Math.ceil(red / Max));

				for( let split = 0; split < splitting; split++ ){

					let splittedValue = Math.max(0, Math.min(Max, value));

					green = Math.min(Math.floor((splittedValue) / 255), 255);
					red = (green > 0 ? 255 : 0);
					blue = Math.floor((splittedValue) - (red * green));

					this.pixels.push(red, green, blue, 255);

					value -= splittedValue;

				};

			};

		}
		else {

			throw new Error("No given pixel color data.");

		};

		return this;

	}
}