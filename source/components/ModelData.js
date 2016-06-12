import ModelObject from "./ModelObject.js";
import Vertex from "./Vertex.js";

export default class ModelData {
	constructor(){

		return this.initialize();

	}
	initialize(){

		this.defaultObject = new ModelObject("default");

		this.currentObject = null;

		this.objects = new Array();

		this.vertices = new Array();

		return this;

	}
	addObject( name ){

		var object = new ModelObject(name);

		this.currentObject = object;

		this.objects.push(object);

		return this;

	}
	addVertex( x, y, z ){

		var index = this.vertices.push(new Vertex(x, y, z));

		if( this.currentObject != null ){

			this.currentObject.addVertex(index);

		}
		else {

			this.defaultObject.addVertex(index);

		};

		return this;

	}
};