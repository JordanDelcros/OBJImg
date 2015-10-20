self.lastProgression = 0;

importScripts("objimg.js");

self.addEventListener("message", function( event ){

	if( event.data.action == "convertImgToObj" ){

		var datas = OBJImg.convertImgToObj(event.data.content);

		postMessage({
			action: event.data.action,
			content: datas
		})

	};

}, false);