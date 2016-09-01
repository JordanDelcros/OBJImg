import ParseMTL from "./ParseMTL.js";
import ModelLibrary from "../components/ModelLibrary.js";
import FileLoader from "../components/FileLoader.js";
import MaterialLibrary from "../components/MaterialLibrary.js";

export default function ParseOBJ( obj, basePath, onComplete ){

	var model = new ModelLibrary();

	var parseOBJComplete = false;
	var parseMTLComplete = true;

	obj.split(/\n+/).forEach(( value, index, array )=>{

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0];

		if( type == "o" ){

			model.addObject(info[1]);

		}
		else if( type == "g" ){

			model.addGroup(info[1]);

		}
		else if( type == "v" ){

			let x = info[1];
			let y = info[2];
			let z = info[3];

			model.addVertex(x, y, z);

		}
		else if( type == "vn" ){

			let x = info[1];
			let y = info[2];
			let z = info[3];

			model.addNormal(x, y, z);

		}
		else if( type == "vt" ){

			let u = info[1];
			let v = info[2];

			model.addTexture(u, v);

		}
		else if( type == "f" ){

			let a = info[1].split(/\//);
			let b = info[2].split(/\//);
			let c = info[3].split(/\//);

			let vertexA = a[0];
			let vertexB = b[0];
			let vertexC = c[0];

			let textureA = a[1];
			let textureB = b[1];
			let textureC = c[1];

			let normalA = a[2];
			let normalB = b[2];
			let normalC = c[2];

			model.addFace(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);

		}
		else if( type == "mtllib" ){

			parseMTLComplete = false;

			let materialLibraryPath = basePath + info[1];

			new FileLoader(materialLibraryPath)
				.then(( file )=>{

					ParseMTL(file.data, file.basePath, ( materialLibrary )=>{

						parseMTLComplete = true;

						model.setMaterialLibrary(materialLibrary);

						if( parseOBJComplete == true && parseMTLComplete == true ){

							onComplete(model);

						};

					})

				})
				.catch(( error )=>{

					throw error;

				});

		}
		else if( type == "usemtl" ){

			model.addMaterial(info[1]);

		};

	});

	parseOBJComplete = true;

	if( parseOBJComplete == true && parseMTLComplete == true ){

		onComplete(model);

	};

};