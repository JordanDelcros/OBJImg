self.lastProgression = 0;

importScripts("objimg.js");

self.addEventListener("message", function( event ){

	var action = event.data.action;

	if( action == "convertIMG" ){

		var datas = OBJImg.convertIMG(event.data.content);

		postMessage({
			action: event.data.action,
			content: datas
		})

	}
	else if( action == "parse" ){

		var datas = OBJImg.parse(event.data.content[0], event.data.content[1]);

		postMessage({
			action: "parse",
			content: datas
		});

	}
	else if( action == "convertOBJ" ){

		// var datas = OBJImg.convertOBJ(event.data.content[0], event.data.content[1]);

		console.warn(event.data);

	};

}, false);