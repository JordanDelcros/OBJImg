import Material from "./Material.js";

export default class MaterialLibrary {
	constructor(){

		this.materials = new Array();

		this.initialize();

	}
	initialize(){

		this.defaultMaterial = new Material("default");

		this.currentMaterial = null;

		this.materials = new Array();

		return this;

	}
	addMaterial( name ){

		var material = new Material(name);

		this.currentMaterial = material;

		this.materials.push(material);

		return this;

	}
	addSpecularForce( force ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setSpecularForce(force);

		}
		else {

			this.defaultMaterial.setSpecularForce(force);

		};

		return this;

	}
}