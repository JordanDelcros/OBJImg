import ParseMTL from "./ParseMTL.js";
import ModelData from "../components/ModelData.js";
import FileLoader from "../components/FileLoader.js";
import MaterialLibrary from "../components/MaterialLibrary.js";

export default function ParseOBJ( obj, basePath, onComplete ){

	var model = new ModelData();

	var parseOBJComplete = false;
	var parseMTLComplete = true;

	obj.split(/\n+/).forEach(( value, index, array )=>{

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0];

		if( type == "o" ){

			model.addObject(info[1]);

		}
		else if( type == "v" ){

			var x = info[1];
			var y = info[2];
			var z = info[3];

			model.addVertex(x, y, z);

		}
		else if( type == "vn" ){

			var x = info[1];
			var y = info[2];
			var z = info[3];

			model.addNormal(x, y, z);

		}
		else if( type == "vt" ){

			var u = info[1];
			var v = info[2];

			model.addTexture(u, v);

		}
		else if( type == "f" ){

			var a = info[1].split(/\//);
			var b = info[2].split(/\//);
			var c = info[3].split(/\//);

			var vertexA = a[0];
			var vertexB = b[0];
			var vertexC = c[0];

			var normalA = a[1];
			var normalB = b[1];
			var normalC = c[1];

			var textureA = a[1];
			var textureB = b[1];
			var textureC = c[1];

			model.addFace(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);

		}
		else if( type == "mtllib" ){

			parseMTLComplete = false;

			var materialLibraryPath = basePath + "/" + info[1];

			var file = new FileLoader(materialLibraryPath, ( fileData, type, path )=>{

				ParseMTL(fileData, file.getBasePath(), ( materialLibrary )=>{

					parseMTLComplete = true;

					model.setMaterialLibrary(materialLibrary);

					if( parseOBJComplete == true && parseMTLComplete == true ){

						console.log("FINISH", model)

					};

				});

			});

		}
		else if( type == "usemtl" ){

			model.addMaterial(info[1]);

		};

	});

	parseOBJComplete = true;

	if( parseOBJComplete == true && parseMTLComplete == true ){

		console.log("FINISH", model)

	};

};