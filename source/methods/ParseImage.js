import ImageReader from "../components/ImageReader.js";

export default function ParseImage( image, basePath, onComplete ){

	console.log("PARSE IMAGE");

	var model = new ImageReader(image);

	onComplete(model);

};