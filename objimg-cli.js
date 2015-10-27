#!/usr/bin/env node

var package = require("./package.json");
var program = require("commander");
var FileSystem = require("fs");
var PNG = require("node-png").PNG;
var OptiPNG = require("optipng");

program
	.version(package.version)
	.option("-o, --output", "Select output path and name")
	.option("-c, --compress [quality]", "Optimize image size with OptiPNG", /^[0-9]{1}$/, parseInt)
	.parse(process.argv);

console.log(program.compress);

// var arguments = process.argv.slice(2);

// var actions = {
// 	input: null,
// 	output: null,
// 	compress: {
// 		active: false,
// 		quality: 1
// 	}
// };

// for( var argument = 0, length = arguments.length; argument < length; argument++ ){

// 	var value = arguments[argument];

// 	if( value == "-i" || value == "--input" ){

// 		actions.input = arguments[++argument];

// 	}
// 	else if( value == "-o" || value == "--output" ){

// 		actions.output = arguments[++argument];

// 	}
// 	else if( value == "-c" || value == "--compress" ){

// 		actions.compress.active = true;

// 		if( /^[0-9]{1}$/.test(arguments[argument + 1]) ){

// 			actions.compress.quality = arguments[++argument];

// 		};

// 	}
// 	else {

// 		throw new Error("Unsuported parameter '" + value + "'.");

// 	};

// };

// console.log(actions);

// var input = arguments[0];

// FileSystem.readFile(input, "utf-8", function( error, content ){

// 	if( error ){

// 		throw error;

// 	};

// 	// console.log(content);

// });