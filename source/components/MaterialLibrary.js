import Material from "./Material.js";

export default class MaterialLibrary {
	constructor(){

		this.materials = new Array();

		this.initialize();

	}
	initialize(){

		this.materials = new Array();

		this.addMaterial(null);

		this.materials[this.materials.length - 1].default = true;

		return this;

	}
	addMaterial( name ){

		if( this.materials[this.materials.length - 1] && this.materials[this.materials.length - 1].default == true ){

			delete this.materials[this.materials.length - 1].default;

			this.materials[this.materials.length - 1].setName(name);

		}
		else {

			this.materials.push(new Material(name));

		};

		return this;

	}
	getMaterial( name ){

		for( let material of this.materials ){

			if( material.name == name ){

				return material;

			};

		};

		return null;

	}
	addSmooth( smooth ){

		this.materials[this.materials.length - 1].setSmooth(smooth);

		return this;

	}
	addIllumination( illumination ){

		this.materials[this.materials.length - 1].setIllumination(illumination);

		return this;

	}
	addAmbientColor( red, green, blue ){

		this.materials[this.materials.length - 1].setAmbientColor(red, green, blue);

		return this;

	}
	addDiffuseColor( red, green, blue ){

		this.materials[this.materials.length - 1].setDiffuseColor(red, green, blue);

		return this;

	}
	addSpecularColor( red, green, blue ){

		this.materials[this.materials.length - 1].setSpecularColor(red, green, blue);

		return this;

	}
	addSpecularForce( force ){

		this.materials[this.materials.length - 1].setSpecularForce(force);

		return this;

	}
	addOpacity( opacity ){

		this.materials[this.materials.length - 1].setOpacity(opacity);

		return this;

	}
	addOpacityTest( test ){

		this.materials[this.materials.length - 1].setOpacityTest(test);

		return this;

	}
	addEnvironementReflectivity( reflectivity ){

		this.materials[this.materials.length - 1].setEnvironementReflectivity(reflectivity);

		return this;

	}
	addMap( map, path ){

		this.materials[this.materials.length - 1].setMap(map, path);

		return this;

	}
	addMapClamp( map, clamp ){

		this.materials[this.materials.length - 1].setMapClamp(map, clamp);

		return this;

	}
	addMapChannel( map, channel ){

		this.materials[this.materials.length - 1].setMapChannel(map, channel);

		return this;

	}
	addShaderSide( side ){

		this.materials[this.materials.length - 1].setShaderSide(side);

		return this;

	}
	addShaderDepthTest( depthTest ){

		this.materials[this.materials.length - 1].setShaderDepthTest(depthTest);

		return this;

	}
	addShaderDepthWrite( depthWrite ){

		this.materials[this.materials.length - 1].setShaderDepthWrite(depthWrite);

		return this;

	}
	addShaderVertex( path ){

		this.materials[this.materials.length - 1].setShaderVertex(path);

		return this;

	}
	addShaderFragment( path ){

		this.materials[this.materials.length - 1].setShaderFragment(path);

		return this;

	}
};