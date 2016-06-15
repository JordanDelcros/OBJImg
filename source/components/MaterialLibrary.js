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
	getMaterial( name ){

		for( let material of this.materials ){

			if( material.name == name ){

				return material;

			};

		};

		return null;

	}
	addSmooth( smooth ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setSmooth(smooth);

		}
		else {

			this.defaultMaterial.setSmooth(smooth);

		};

		return this;

	}
	addIllumination( illumination ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setIllumination(illumination);

		}
		else {

			this.defaultMaterial.setIllumination(illumination);

		};

		return this;

	}
	addAmbientColor( red, green, blue ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setAmbientColor(red, green, blue);

		}
		else {

			this.defaultMaterial.setAmbientColor(red, green, blue);

		};

		return this;

	}
	addDiffuseColor( red, green, blue ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setDiffuseColor(red, green, blue);

		}
		else {

			this.defaultMaterial.setDiffuseColor(red, green, blue);

		};

		return this;

	}
	addSpecularColor( red, green, blue ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setSpecularColor(red, green, blue);

		}
		else {

			this.defaultMaterial.setSpecularColor(red, green, blue);

		};

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
	addOpacity( opacity ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setOpacity(opacity);

		}
		else {

			this.defaultMaterial.setOpacity(opacity);

		};

		return this;

	}
	addOpacityTest( test ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setOpacityTest(test);

		}
		else {

			this.defaultMaterial.setOpacityTest(test);

		};

		return this;

	}
	addEnvironementReflectivity( reflectivity ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setEnvironementReflectivity(reflectivity);

		}
		else {

			this.defaultMaterial.setEnvironementReflectivity(reflectivity);

		};

		return this;

	}
	addMap( map, path ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setMap(map, path);

		}
		else {

			this.defaultMaterial.setMap(map, path);

		};

		return this;

	}
	addMapClamp( map, clamp ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setMapClamp(map, clamp);

		}
		else {

			this.defaultMaterial.setMapClamp(map, clamp);

		};

		return this;

	}
	addMapChannel( map, channel ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setMapChannel(map, channel);

		}
		else {

			this.defaultMaterial.setMapChannel(map, channel);

		};

		return this;

	}
	addShaderSide( side ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setShaderSide(side);

		}
		else {

			this.defaultMaterial.setShaderSide(side);

		};

		return this;

	}
	addShaderDepthTest( depthTest ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setShaderDepthTest(depthTest);

		}
		else {

			this.defaultMaterial.setShaderDepthTest(depthTest);

		};

		return this;

	}
	addShaderDepthWrite( depthWrite ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setShaderDepthWrite(depthWrite);

		}
		else {

			this.defaultMaterial.setShaderDepthWrite(depthWrite);

		};

		return this;

	}
	addShaderVertex( path ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setShaderVertex(path);

		}
		else {

			this.defaultMaterial.setShaderVertex(path);

		};

		return this;

	}
	addShaderFragment( path ){

		if( this.currentMaterial != null ){

			this.currentMaterial.setShaderFragment(path);

		}
		else {

			this.defaultMaterial.setShaderFragment(path);

		};

		return this;

	}
}