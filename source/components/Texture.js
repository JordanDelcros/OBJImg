export default class Texture {
	constructor( u, v ){

		return this.initialize(u, v);

	}
	initialize( u, v ){

		this.u = parseFloat(u);
		this.v = parseFloat(v);

		return this;

	}
};