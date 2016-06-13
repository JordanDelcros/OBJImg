export default class Face {
	constructor( vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC ){

		return this.initialize(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);

	}
	initialize( vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC ){

		this.vertexA = parseInt(vertexA) - 1;
		this.vertexB = parseInt(vertexB) - 1;
		this.vertexC = parseInt(vertexC) - 1;

		this.normalA = parseInt(normalA) - 1;
		this.normalB = parseInt(normalB) - 1;
		this.normalC = parseInt(normalC) - 1;

		this.textureA = parseInt(textureA) - 1;
		this.textureB = parseInt(textureB) - 1;
		this.textureC = parseInt(textureC) - 1;

		return this;

	}
};