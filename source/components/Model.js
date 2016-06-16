export default class Model {
	constructor( name ){

		return this.initialize( name );

	}
	initialize( name ){

		this.groups = new Array();

		this.addGroup(null);

		this.groups[this.groups.length - 1].default = true;

		this.setName(name);

		return this;

	}
	addGroup( name ){

		if( this.groups[this.groups.length - 1] && this.groups[this.groups.length - 1].default == true ){

			delete this.groups[this.groups.length - 1].default;

			this.setName(name);

		}
		else {

			this.groups.push({
				vertices: new Array(),
				normals: new Array(),
				textures: new Array(),
				faces: new Array()
			});

		};

		return this;

	}
	setName( name = null ){

		this.groups[this.groups.length - 1].name = name;

		return this;

	}
	addVertex( index ){

		this.groups[this.groups.length - 1].vertices.push(index);

		return this;

	}
	addNormal( index ){

		this.groups[this.groups.length - 1].normals.push(index);

		return this;

	}
	addTexture( index ){

		this.groups[this.groups.length - 1].textures.push(index);

		return this;

	}
	addFace( index ){

		this.groups[this.groups.length - 1].faces.push(index);

		return this;

	}
	setMaterial( name ){

		this.groups[this.groups.length - 1].material = name;

		return this;

	}
}