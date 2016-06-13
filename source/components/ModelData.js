import Model from "./Model.js";
import Vertex from "./Vertex.js";
import Normal from "./Normal.js";
import Texture from "./Texture.js";
import Face from "./Face.js";

export default class ModelData {
	constructor(){

		return this.initialize();

	}
	initialize(){

		this.defaultObject = new Model("default");

		this.currentObject = null;

		this.materialLibrary = null;

		this.objects = new Array();

		this.vertices = new Array();

		this.normals = new Array();

		this.textures = new Array();

		this.faces = new Array();

		return this;

	}
	addObject( name ){

		var object = new Model(name);

		this.currentObject = object;

		this.objects.push(object);

		return this;

	}
	addVertex( x, y, z ){

		var index = this.vertices.push(new Vertex(x, y, z)) - 1;

		if( this.currentObject != null ){

			this.currentObject.addVertex(index);

		}
		else {

			this.defaultObject.addVertex(index);

		};

		return this;

	}
	addNormal( x, y, z ){

		var index = this.normals.push(new Normal(x, y, z)) - 1;

		if( this.currentObject != null ){

			this.currentObject.addNormal(index);

		}
		else {

			this.defaultObject.addNormal(index);

		};

		return this;

	}
	addTexture( u, v ){

		var index = this.textures.push(new Texture(u, v)) - 1;

		if( this.currentObject != null ){

			this.currentObject.addTexture(index);

		}
		else {

			this.defaultObject.addTexture(index);

		};

		return this;

	}
	addFace( vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC ){

		var index = this.faces.push(new Face(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC)) - 1;

		if( this.currentObject != null ){

			this.currentObject.addFace(index);

		}
		else {

			this.defaultObject.addFace(index);

		};

		return this;

	}
	setMaterialLibrary( materialLibrary ){

		this.materialLibrary = materialLibrary;

		return this;

	}
	addMaterial( name ){

		if( this.currentObject != null ){

			this.currentObject.setMaterial(name);

		}
		else {

			this.defaultObject.setMaterial(name);

		};

		return this;

	}
};