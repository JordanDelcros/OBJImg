import MaterialLibrary from "../components/MaterialLibrary.js";
import Dictionary from "../components/Dictionary.js";

export const MapType = {
	map_ka: "ambient",
	map_kd: "diffuse",
	map_ks: "specular",
	map_ns: "specularForce",
	map_kn: "normal",
	map_ke: "environement",
	map_bump: "bump",
	map_d: "opacity"
};

export default function ParseMTL( mtl, basePath, onComplete ){

	var materialLibrary = new MaterialLibrary();

	mtl.split(/\n+/).forEach(( value, index, array )=>{

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0].toLowerCase();

		// console.log(info);

		if( type == "newmtl" ){

			materialLibrary.addMaterial(info[1]);

		}
		else if( type == "s" ){

			materialLibrary.addSmooth(info[1]);

		}
		else if( type == "illum" ){

			materialLibrary.addIllumination(info[1]);

		}
		else if( type == "ka" ){

			materialLibrary.addAmbientColor(info[1], info[2], info[3]);

		}
		else if( type == "kd" ){

			materialLibrary.addDiffuseColor(info[1], info[2], info[3]);

		}
		else if( type == "ks" ){

			materialLibrary.addSpecularColor(info[1], info[2], info[3]);

		}
		else if( type == "ns" ){

			materialLibrary.addSpecularForce(info[1]);

		}
		else if( type == "d" ){

			materialLibrary.addOpacity(info[1]);

		}
		else if( type == "ne" ){

			materialLibrary.addEnvionementReflectivity(info[1]);

		}
		else if( type.substr(0, 3) == "map" ){

			var mapType = MapType[type];

			var path = info.pop();

			materialLibrary.addMap(mapType, path);

			for( let optionIndex = 1, length = info.length; optionIndex < length; optionIndex++ ){

				var option = info[optionIndex];

				if( option == "-clamp" ){

					materialLibrary.addMapClamp(mapType, info[++optionIndex]);

				}
				else if( option == "-imfchan" ){

					materialLibrary.addMapChannel(mapType, info[++optionIndex]);

				}
				else if( option == "-test" ){

					materialLibrary.addOpacityTest(info[++optionIndex]);

				};

			};

		}
		else if( type == "shader_s" ){

			materialLibrary.addShaderSide(info[1]);

		}
		else if( type == "shader_dt" ){

			materialLibrary.addShaderDepthTest(info[1]);

		}
		else if( type == "shader_dw" ){

			materialLibrary.addShaderDepthWrite(info[1]);

		}
		else if( type == "shader_v" ){

			materialLibrary.addShaderVertex(info[1]);

		}
		else if( type == "shader_f" ){

			materialLibrary.addShaderFragment(info[1]);

		};

	});

	onComplete(materialLibrary);

};