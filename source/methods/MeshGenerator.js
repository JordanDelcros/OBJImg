import { THREE } from "../OBJImage.js";

export default class MeshGenerator {
	constructor( modelLibrary ){

		return this.initialize(modelLibrary);

	}
	initialize( modelLibrary ){

		console.warn("MESH GENERATOR", modelLibrary);

		var indices = new Uint32Array(modelLibrary.faces.length * 3);

		for( let index = 0; index < indices.length; index++ ){

			indices[index] = index;

		};

		var positions = new Float32Array(modelLibrary.faces.length * 3 * 3);

		for( let faceIndex = 0, faceLength = modelLibrary.faces.length; faceIndex < faceLength; faceIndex++ ){

			console.log(faceIndex);

		};

		return this;

	}
};