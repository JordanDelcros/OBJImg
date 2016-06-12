import ModelData from "../components/ModelData.js";

export default function ParseOBJ( obj, onComplete ){

	var model = new ModelData();

	obj.split(/\n/).forEach(( value, index, array )=>{

		var info = value.split(/\s+/);

		var type = info[0];

		if( type == "o" ){

			model.addObject(info[1]);

		}
		else if( type == "v" ){

			var x = info[1];
			var y = info[2];
			var z = info[3];

			model.addVertex(x, y, z);

		};

	});

	console.log(model);

};