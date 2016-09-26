import Model from "./Model.js";
import Vertex from "./Vertex.js";
import Normal from "./Normal.js";
import Texture from "./Texture.js";
import Face from "./Face.js";
import Bounds from "./Bounds.js";
import ImageGenerator from "./ImageGenerator.js";

export default class ModelLibrary {
	constructor(){

		return this.initialize();

	}
	initialize(){

		this.objects = new Array();

		this.vertices = new Array();

		this.bounds = new Bounds();

		this.normals = new Array();

		this.textures = new Array();

		this.faces = new Array();

		this.materialLibrary = null;

		this.addObject(null);

		this.objects[this.objects.length - 1].default = true;

		return this;

	}
	addObject( name ){

		if( this.objects[this.objects.length - 1] && this.objects[this.objects.length - 1].default == true ){

			delete this.objects[this.objects.length - 1].default;

			this.objects[this.objects.length - 1].name = name;

		}
		else {

			this.objects.push(new Model(name));

		};

		return this;

	}
	getObject( name ){

		if( typeof name == "string" ){

			for( let object of this.objects ){

				if( object.name == name ){

					return object;

				};

			};

		}
		else if( typeof name == "number" ){

			return this.objects[name];

		};

		return undefined;

	}
	addGroup( name ){

		this.objects[this.objects.length - 1].addGroup(name);

		return this;

	}
	addVertex( x, y, z ){

		var index = this.vertices.push(new Vertex(x, y, z)) - 1;

		this.objects[this.objects.length - 1].addVertex(index);

		this.bounds.measure(x, y, z);

		return this;

	}
	addNormal( x, y, z ){

		var index = this.normals.push(new Normal(x, y, z)) - 1;

		this.objects[this.objects.length - 1].addNormal(index);

		return this;

	}
	addTexture( u, v ){

		var index = this.textures.push(new Texture(u, v)) - 1;

		this.objects[this.objects.length - 1].addTexture(index);

		return this;

	}
	addFace( vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC ){

		var index = this.faces.push(new Face(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC)) - 1;

		this.objects[this.objects.length - 1].addFace(index);

		return this;

	}
	setMaterialLibrary( materialLibrary ){

		this.materialLibrary = materialLibrary;

		return this;

	}
	addMaterial( name ){

		this.objects[this.objects.length - 1].setMaterial(name);

		return this;

	}
	toImage(){

		return new ImageGenerator(this);

	}
};