export default class Material {
	constructor( name ){

		return this.initialize(name);

	}
	initialize( name ){

		this.name = name;

		this.smooth = true;

		this.specular = {
			force: 1
		};

		return this;

	}
	setSpecularForce( force ){

		this.specular.force = parseFloat(force);

		return this;

	}
}