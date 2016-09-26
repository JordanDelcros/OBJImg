import { Max } from "./ImageGenerator.js";
import ModelLibrary from "../components/ModelLibrary.js";
import Vertex from "./Vertex.js";
import Normal from "./Normal.js";
import Texture from "./Texture.js";
import Face from "./Face.js";
import Material, { ChannelType, SideType } from "./Material.js";
import Dictionary from "./Dictionary.js";

export default class ImageReader {
	constructor( image ){

		this.pixelIndex = 0;

		return this.initialize(image);

	}
	initialize( image ){

		console.log("IMAGE READER");

		var model = new ModelLibrary();

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;

		context.drawImage(image, 0, 0);

		this.pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

		// for( let pixel = 0; pixel < this.pixels.length; pixel++ ){

		// 	if( this.pixels[pixel] != window.generated[pixel] ){

		// 		console.log("DIFFERENT", pixel, this.pixels[pixel], window.generated[pixel]);
		// 		break;

		// 	};

		// };

		var version = this.getRawPixel();

		var compressionType = this.getPixel();

		var verticesMultiplicator = this.getPixel();

		var verticesPivot = (this.getPixel() / verticesMultiplicator);

		var verticesCountSplitting = this.getPixel();

		var verticesCount = this.getPixel(verticesCountSplitting);

		var vertices = new Array();

		for( let vertexIndex = 0; vertexIndex < verticesCount; vertexIndex++ ){

			let x = ((this.getPixel() / verticesMultiplicator) - verticesPivot);
			let y = ((this.getPixel() / verticesMultiplicator) - verticesPivot);
			let z = ((this.getPixel() / verticesMultiplicator) - verticesPivot);

			vertices.push(new Vertex(x, y, z));

		};

		var normalsMultiplicator = Math.floor(Max / 2);

		var normalsCountSplitting = this.getPixel();

		var normalsCount = this.getPixel(normalsCountSplitting);

		var normals = new Array();

		for( let normalIndex = 0; normalIndex < normalsCount; normalIndex++ ){

			let x = ((this.getPixel() / normalsMultiplicator) - 1);
			let y = ((this.getPixel() / normalsMultiplicator) - 1);
			let z = ((this.getPixel() / normalsMultiplicator) - 1);

			normals.push(new Normal(x, y, z));

		};

		var texturesCountSplitting = this.getPixel();

		var texturesCount = this.getPixel(texturesCountSplitting);

		var textures = new Array();

		for( let textureIndex = 0; textureIndex < texturesCount; textureIndex++ ){

			let u = (this.getPixel() / Max);
			let v = (this.getPixel() / Max);

			textures.push(new Texture(u, v));

		};

		var facesCountSplitting = this.getPixel();

		var facesCount = this.getPixel(facesCountSplitting);

		var faces = new Array();

		for( let faceIndex = 0; faceIndex < facesCount; faceIndex++ ){

			let vertexA = this.getPixel(verticesCountSplitting) + 1;
			let vertexB = this.getPixel(verticesCountSplitting) + 1;
			let vertexC = this.getPixel(verticesCountSplitting) + 1;

			let normalA = this.getPixel(normalsCountSplitting) + 1;
			let normalB = this.getPixel(normalsCountSplitting) + 1;
			let normalC = this.getPixel(normalsCountSplitting) + 1;

			let textureA = this.getPixel(texturesCountSplitting) + 1;
			let textureB = this.getPixel(texturesCountSplitting) + 1;
			let textureC = this.getPixel(texturesCountSplitting) + 1;

			faces.push(new Face(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC));

		};

		var materialsCountSplitting = this.getPixel();

		var materialsCount = this.getPixel(materialsCountSplitting);

		console.log("mc", materialsCountSplitting, materialsCount);

		var materials = new Array();

		for( let materialIndex = 0; materialIndex < 1; materialIndex++ ){

			var material = new Material();

			let nameLettersCount = this.getPixel();

			let nameLetters = new Array();

			for( let nameLetter = 0; nameLetter < nameLettersCount; nameLetter++ ){

				nameLetters.push(this.getPixel());

			};

			material.setName(new Dictionary(nameLetters).toString());

			material.setIllumination(this.getPixel());

			material.setSmooth(this.getPixel());

			let ambientColor = this.getRawPixel();

			material.setAmbientColor((ambientColor.red / Max), (ambientColor.green / Max), (ambientColor.blue / Max));

			let hasAmbientMap = (this.getPixel() == 1 ? true : false);

			if( hasAmbientMap == true ){

				material.setMapClamp("ambient", this.getPixel());

				material.setMapChannel("ambient", this.getPixel());

			};

			materials.push(material);

		};

		console.log(materials)

		return this;

	}
	getRawPixel(){

		var red = this.pixels[(this.pixelIndex * 4) + 0];
		var green = this.pixels[(this.pixelIndex * 4) + 1];
		var blue = this.pixels[(this.pixelIndex * 4) + 2];
		var alpha = this.pixels[(this.pixelIndex * 4) + 3];

		this.pixelIndex++;

		return {red, green, blue, alpha};

	}
	getPixel( groupLength = 1 ){

		var result = 0;

		for( let group = 0; group < groupLength; group++){

			var pixel = this.getRawPixel();

			result += (pixel.red * pixel.green + pixel.blue);

		};

		return result

	}
}