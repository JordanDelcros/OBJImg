import ModelLibrary from "../components/ModelLibrary.js";

export default function ParseImage( image, basePath, onComplete ){

	console.log("PARSE IMAGE", image);

	var model = new ModelLibrary();

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = image.width;
	canvas.height = image.height;

	context.drawImage(image, 0, 0);

	var pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

	console.log(pixels);

	onComplete(model);

};