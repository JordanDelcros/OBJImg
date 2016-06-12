export default class ModelObject {
	constructor( name ){

		return this.initialize( name );

	}
	initialize( name ){

		this.setName(name);

		this.vertices = new Array();

		return this;

	}
	setName( name = null ){

		this.name = name;

		return this;

	}
	addVertex( index ){

		this.vertices.push(index);

		return this;

	}
}