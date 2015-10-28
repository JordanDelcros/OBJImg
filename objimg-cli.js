#!/usr/bin/env node

var package = require("./package.json");
var FileSystem = require("fs");
var Path = require("path");
var Program = require("commander");
var PNG = require("node-png").PNG;
var OptiPNG = require("optipng");
var OBJImg = require("./objimg.js");

Program
	.version(package.version)
	.usage("[options] <file>")
	.option("-o, --output <file>", "Select output path and name")
	.action(function( OBJPath ){

		if( !Program.output ){

			Program.output = OBJPath + ".png";

		};

		var OBJContent = "";
		var MTLContent = "";

		if( FileSystem.lstatSync(OBJPath).isFile() && FileSystem.existsSync(OBJPath) ){

			OBJContent = FileSystem.readFileSync(OBJPath, "utf-8");

			var MTLLibrary = (OBJContent.match(/(?:\n|^)\s*mtllib\s([^\n\r]+)/) || [])[1];
			var MTLPath = Path.dirname(OBJPath) + "/" + (MTLLibrary || "");

			if( FileSystem.lstatSync(MTLPath).isFile() && FileSystem.existsSync(MTLPath) ){

				MTLContent = FileSystem.readFileSync(MTLPath, "utf-8");

			};

		};

		var pixelsArray = OBJImg.convertOBJ(OBJContent, MTLContent);
		var square = Math.ceil(Math.sqrt(pixelsArray.length / 4));

		var PNGFile = new PNG({
			width: square,
			height: square
		});

		for( var pixelData = 0, length = PNGFile.data.length; pixelData < length; pixelData++ ){

			PNGFile.data[pixelData] = pixelsArray[pixelData];

		};

		var optimizer = new OptiPNG(["-o7"]);

		console.log(optimizer);

		PNGFile
			.pack()
			.pipe(optimizer)
			.pipe(FileSystem.createWriteStream(Program.output));

	})
	.parse(process.argv);