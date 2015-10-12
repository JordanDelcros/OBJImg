importScripts("objimg.js");

onmessage = function( event ){

	postMessage(OBJImg[event.data[0]](event.data[1]));

};