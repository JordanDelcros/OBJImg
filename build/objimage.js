(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.OBJImage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FileLoader = require("./components/FileLoader.js");

var _FileLoader2 = _interopRequireDefault(_FileLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OBJImage = function () {
	function OBJImage(path) {
		_classCallCheck(this, OBJImage);

		return this.initialize(path);
	}

	_createClass(OBJImage, [{
		key: "initialize",
		value: function initialize(path) {

			this.file = new _FileLoader2.default(path);

			return this;
		}
	}]);

	return OBJImage;
}();

exports.default = OBJImage;


if (typeof define !== "undefined" && define instanceof Function && define.amd !== undefined) {

	define(function () {

		return OBJImage;
	});
} else if (typeof module !== "undefined" && module.exports) {

	module.exports = OBJImage;
} else if (typeof self !== "undefined") {

	self.OBJImage = OBJImage;
};

},{"./components/FileLoader.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var TYPE = exports.TYPE = {
	IMAGE: 0,
	OBJ: 1,
	MTL: 2,
	JSON: 3,
	OBJIMAGE: 4
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require("./Constants.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileLoader = function () {
	function FileLoader(path) {
		_classCallCheck(this, FileLoader);

		return this.initialize(path);
	}

	_createClass(FileLoader, [{
		key: "initialize",
		value: function initialize(path) {

			this.path = path;

			if (/\.(png|jpe?g|gif|bmp)$/.test(this.path)) {

				this.type = _Constants.TYPE.IMAGE;

				this.content = FileLoader.loadImage(this.path, function (image) {

					console.log(image);
				}, function (error) {

					console.error(error);
				});
			} else if (/\.obj$/g.test(this.path)) {

				this.type = _Constants.TYPE.OBJ;

				this.content = FileLoader.loadText();
			} else if (/\.mtl$/g.test(this.path)) {

				this.type = _Constants.TYPE.MTL;

				this.content = FileLoader.loadText();
			} else if (/\.json$/g.test(this.path)) {

				this.type = _Constants.TYPE.JSON;

				this.content = FileLoader.loadText(this.path);
			};

			return this;
		}
	}]);

	return FileLoader;
}();

exports.default = FileLoader;
;

FileLoader.loadImage = function FileLoaderLoadImage(path, onComplete, onFail) {

	console.log("LOAD IMAGE");

	var image = new Image();

	image.addEventListener("load", onComplete.bind(this, image), false);
	image.addEventListener("error", onFail.bind(this), false);

	image.src = path;

	return image;
};

FileLoader.loadText = function FileLoaderLoadText(path, onComplete, onFail) {

	console.log("LOAD TEXT", path);

	var text = new String();

	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", function (event) {

		if (event.target.readyState == XMLHttpRequest.UNSED) {} else if (event.target.readyState == XMLHttpRequest.OPENED) {} else if (event.target.readyState == XMLHttpRequest.HEADERS_RECEIVED) {} else if (event.target.readyState == XMLHttpRequest.LOADING) {} else if (event.target.readyState == XMLHttpRequest.DONE) {

			if (event.target.status >= 200 && event.target.status < 400) {} else if (event.target.status >= 400) {};
		}
	}, false);

	request.open("GET", path, true);

	request.send(null);

	return text;
};

},{"./Constants.js":2}]},{},[1])(1)
});