export default class Vertex {
	constructor( x, y, z ){

		return this.initialize(x, y, z);

	}
	initialize( x, y, z ){

		this.x = parseFloat(x);
		this.y = parseFloat(y);
		this.z = parseFloat(z);

		return this;

	}
};