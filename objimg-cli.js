#!/usr/bin/env node

var package = require("./package.json");
var FileSystem = require("fs");
var Path = require("path");
var Program = require("commander");
var PNG = require("node-png").PNG;
var OptiPNG = require("optipng");
var OBJImg = require("./objimg.js");
var Colors = require("colors");
var YesNo = require("yesno");
var OnDeath = require("death");

var nothing = true;

function Error( message ){

	message = message.replace(/(\')([^\']*)(\')/g, "'" + "$2".underline + "'");

	console.error(("\n  Error: " + message + "\n").red);

};

function Warning( message ){

	message = message.replace(/(\')([^\']*)(\')/g, "'" + "$2".underline + "'");

	console.warn(("\n  Warning: " + message + "\n").yellow);

};

function Info( message ){

	message = message.replace(/(\')([^\']*)(\')/g, "'" + "$2".underline + "'");

	console.info(("\n  Info: " + message + "\n").blue);

};

function Log( message ){

	message = message.replace(/(\')([^\']*)(\')/g, "'" + "$2".underline + "'");

	console.log(("\n  Log: " + message + "\n").white);

};

Program
	.version(package.version)
	.usage("[options] <file>")
	.option("-o, --output <file>", "Select output path and name.")
	.option("-v, --verbose", "Display information logs.")
	.action(function( OBJPath ){

		nothing = false;

		if( FileSystem.existsSync(OBJPath) ){

			if( Program.verbose ){

				new Info("Found the OBJ file '" + OBJPath + "'.");

			};

			if( !Program.output ){

				Program.output = OBJPath + ".png";

				if( Program.verbose ){

					new Info("Output set as '" + Program.output + "'.");

				};

			};

			var OBJContent = "";
			var MTLContent = "";

			if( FileSystem.lstatSync(OBJPath).isFile() ){

				OBJContent = FileSystem.readFileSync(OBJPath, "utf-8");

				var MTLLibrary = (OBJContent.match(/(?:\n|^)\s*mtllib\s([^\n\r]+)/) || [])[1];
				var MTLPath = Path.dirname(OBJPath) + "/" + (MTLLibrary || "");

				if( FileSystem.existsSync(MTLPath) && FileSystem.lstatSync(MTLPath).isFile() ){

					if( Program.verbose ){

						new Info("Found the MTL file '" + MTLPath + "'");

					};

					MTLContent = FileSystem.readFileSync(MTLPath, "utf-8");

				}
				else if( MTLLibrary != undefined ){

					new Warning("Cant found MTL file '" + MTLPath + "'.");

				};

			};

			if( Program.verbose ){

				new Info("Start generating PNG file.");

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

			if( Program.verbose ){

				new Info("Finished generating PNG file.");

				new Info("Start optimizing with OptiPNG.");

			};

			var optimizer = new OptiPNG(["-o7"]);

			optimizer.on("end", function(){

				if( Program.verbose ){

					new Info("PNG file successfully generated and optimized.");

				};

				var sourceSize = (FileSystem.statSync(OBJPath).size / 1000000).toFixed(2);
				var newSize = (FileSystem.statSync(Program.output).size / 1000000).toFixed(2);
				var percentLighter = ((1 - (newSize / sourceSize)) * 100).toFixed(2);

				new Log("PNG successfully generated! " + newSize + "Mo (" + percentLighter + "% lighter).");

			});

			PNGFile
				.pack()
				.pipe(optimizer)
				.pipe(FileSystem.createWriteStream(Program.output));

			OnDeath(function( signal, error ){

				FileSystem.unlink(Program.output);

				new Log("You stopped the process, the PNG as been ereased.");
				process.exit();

			});

		}
		else {

			new Error("Cant found OBJ file '" + OBJPath + "'.");

		};

	})
	.parse(process.argv);

if( nothing == true ){

	new Error("Missed file path.")

};