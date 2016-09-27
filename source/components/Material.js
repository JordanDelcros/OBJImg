export const ChannelType = {
	rgb: 0,
	r: 1,
	g: 2,
	b: 3
};

export const SideType = {
	front: 0,
	back: 1,
	double: 2
};

export default class Material {
	constructor( name ){

		return this.initialize(name);

	}
	initialize( name ){

		this.setName(name);

		this.setSmooth(true);

		this.setIllumination(2);

		this.ambient = {
			red: 1,
			green: 1,
			blue: 1,
			map: null,
			clamp: false,
			channel: ChannelType.rgb
		};

		this.diffuse = {
			red: 1,
			green: 1,
			blue: 1,
			map: null,
			clamp: false,
			channel: ChannelType.rgb
		};

		this.bump = {
			red: 1,
			green: 1,
			blue: 1,
			map: null,
			clamp: false,
			channel: ChannelType.rgb
		};

		this.specular = {
			red: 1,
			green: 1,
			blue: 1,
			map: null,
			clamp: false,
			channel: ChannelType.rgb
		};

		this.specularForce = {
			value: 1,
			map: null,
			clamp: false,
			channel: ChannelType.rgb
		};

		this.opacity = {
			value: 1,
			map: null,
			clamp: false,
			channel: ChannelType.rgb
		};

		this.environement = {
			reflectivity: 0,
			map: null,
			clamp: false,
			channel: ChannelType.rgb
		};

		this.shader = {
			side: SideType.front,
			depthTest: true,
			depthWrite: true,
			vertex: null,
			fragment: null
		};

		return this;

	}
	setName( name = null ){

		this.name = name;

		return this;

	}
	setSmooth( smooth = true ){

		this.smooth = (smooth == true || parseInt(smooth) == 1 || smooth == "on" ? true : false);

		return this;

	}
	setIllumination( illumination = 1 ){

		this.illumination = parseInt(illumination);

		return this;

	}
	setAmbientColor( red = 1, green = 1, blue = 1 ){

		this.ambient.red = parseFloat(red);
		this.ambient.green = parseFloat(green);
		this.ambient.blue = parseFloat(blue);

		return this;

	}
	setDiffuseColor( red = 1, green = 1, blue = 1 ){

		this.diffuse.red = parseFloat(red);
		this.diffuse.green = parseFloat(green);
		this.diffuse.blue = parseFloat(blue);

		return this;

	}
	setBumpColor( red = 1, green = 1, blue = 1 ){

		this.bump.red = parseFloat(red);
		this.bump.green = parseFloat(green);
		this.bump.blue = parseFloat(blue);

		return this;

	}
	setSpecularColor( red = 1, green = 1, blue = 1 ){

		this.specular.red = parseFloat(red);
		this.specular.green = parseFloat(green);
		this.specular.blue = parseFloat(blue);

		return this;

	}
	setSpecularForce( force = 1 ){

		this.specularForce.value = parseFloat(force);

		return this;

	}
	setOpacity( opacity = 1 ){

		this.opacity.value = parseFloat(opacity);

		return this;

	}
	setOpacityTest( test = 0 ){

		this.opacity.test = test;

		return this;

	}
	setEnvironementReflectivity( reflectivity = 0 ){

		this.environement.reflectivity = reflectivity;

		return this;

	}
	setMap( map, path = null ){

		if( this[map] != undefined ){

			this[map].map = path;

		};

		return this;

	}
	setMapClamp( map, clamp = false ){

		if( this[map] != undefined ){

			this[map].clamp = (clamp == true || parseInt(clamp) == 1 || clamp == "on" ? true : false);

		};

		return this;

	}
	setMapChannel( map, channel = "rgb" ){

		if( this[map] != undefined ){

			if( typeof channel == "string" ){

				this[map].channel = ChannelType[channel];

			}
			else {

				this[map].channel = channel;

			};

		};

		return this;

	}
	setShaderSide( side = "front" ){

		this.shader.side = side;

		return this;

	}
	setShaderDepthTest( depthTest = true ){

		this.shader.depthTest = (depthTest == true || parseInt(depthTest) == 1 || depthTest == "on");

	}
	setShaderDepthWrite( depthWrite = true ){

		this.shader.depthWrite = (depthWrite == true || parseInt(depthWrite) == 1 || depthWrite == "on");

	}
	setShaderVertex( path = null ){

		this.shader.vertex = path;

		return this;

	}
	setShaderFragment( path = null ){

		this.shader.fragment = path;

		return this;

	}
}