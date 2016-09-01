export default class Face {
	constructor( vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC ){

		return this.initialize(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);

	}
	initialize( vertexA, vertexB, vertexC, normalA = null, normalB = null, normalC = null, textureA = null, textureB = null, textureC = null ){

		this.vertexA = null || parseInt(vertexA) - 1;
		this.vertexB = null || parseInt(vertexB) - 1;
		this.vertexC = null || parseInt(vertexC) - 1;

		this.normalA = null || parseInt(normalA) - 1;
		this.normalB = null || parseInt(normalB) - 1;
		this.normalC = null || parseInt(normalC) - 1;

		this.textureA = null || parseInt(textureA) - 1;
		this.textureB = null || parseInt(textureB) - 1;
		this.textureC = null || parseInt(textureC) - 1;

		return this;

	}
};