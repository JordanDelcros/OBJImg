export default class Face {
	constructor( vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC ){

		return this.initialize(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);

	}
	initialize( vertexA, vertexB, vertexC, normalA = null, normalB = null, normalC = null, textureA = null, textureB = null, textureC = null ){

		this.vertexA = parseInt(vertexA) - 1;
		this.vertexB = parseInt(vertexB) - 1;
		this.vertexC = parseInt(vertexC) - 1;

		this.normalA = parseInt(normalA) - 1 || null;
		this.normalB = parseInt(normalB) - 1 || null;
		this.normalC = parseInt(normalC) - 1 || null;

		this.textureA = parseInt(textureA) - 1 || null;
		this.textureB = parseInt(textureB) - 1 || null;
		this.textureC = parseInt(textureC) - 1 || null;

		return this;

	}
};