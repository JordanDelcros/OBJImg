#!/usr/bin/env node

var package = require("./package.json");
var FileSystem = require("fs");
var Path = require("path");
var Progress = require("progress");
var Program = require("commander");
var PNG = require("pngjs").PNG;
var OptiPNG = require("optipng");
var OBJImg = require("./objimg.js");

Program
	.version(package.version)
	.usage("[options] <file>")
	.option("-o, --output <file>", "Select output path and name")
	.option("-c, --compress", "Optimize image size with OptiPNG")
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

		var pixels = OBJImg.convertOBJ(OBJContent, MTLContent);
		var square = Math.ceil(Math.sqrt(pixels.length / 4));

		var PNGFile = new PNG({
			filterType: 0,
			colorType: 6,
			width: square,
			height: square,
			data: pixels
		});

		console.log(PNGFile.data.length);

		PNGFile.pack().pipe(FileSystem.createWriteStream(Program.output));

	})
	.parse(process.argv);