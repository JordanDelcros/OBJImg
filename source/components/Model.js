export default class Model {
	constructor( name ){

		return this.initialize( name );

	}
	initialize( name ){

		this.setName(name);

		this.vertices = new Array();

		this.normals = new Array();

		this.textures = new Array();

		this.faces = new Array();

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
	addNormal( index ){

		this.normals.push(index);

		return this;

	}
	addTexture( index ){

		this.textures.push(index);

		return this;

	}
	addFace( index ){

		this.faces.push(index);

		return this;

	}
	setMaterial( name ){

		this.material = name;

		return this;

	}
}