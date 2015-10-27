#! /usr/bin/env node

var FileSystem = require("fs");
var PNG = require("node-png").PNG;

var arguments = process.argv.slice(2);

var input = arguments[0];

console.log("OBJImg: ", arguments);

FileSystem.readFile(input, "utf-8", function( error, content ){

	if( error ){

		throw error;

	};

	console.log(content);

});