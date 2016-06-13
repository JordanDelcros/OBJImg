import MaterialLibrary from "../components/MaterialLibrary.js";

export default function ParseMTL( mtl, basePath, onComplete ){

	var materialLibrary = new MaterialLibrary();

	mtl.split(/\n+/).forEach(( value, index, array )=>{

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0].toLowerCase();

		// console.log(info);

		if( type == "newmtl" ){

			materialLibrary.addMaterial(info[1]);

		}
		else if( type == "ns" ){

			materialLibrary.addSpecularForce(info[1]);

		};

	});

	onComplete(materialLibrary);

};