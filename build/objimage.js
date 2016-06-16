(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.OBJImage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FileLoader = require("./components/FileLoader.js");

var _FileLoader2 = _interopRequireDefault(_FileLoader);

var _ParseImage = require("./methods/ParseImage.js");

var _ParseImage2 = _interopRequireDefault(_ParseImage);

var _ParseOBJ = require("./methods/ParseOBJ.js");

var _ParseOBJ2 = _interopRequireDefault(_ParseOBJ);

var _ParseJSON = require("./methods/ParseJSON.js");

var _ParseJSON2 = _interopRequireDefault(_ParseJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OBJImage = function () {
	function OBJImage(path, options) {
		_classCallCheck(this, OBJImage);

		return this.initialize(path, options);
	}

	_createClass(OBJImage, [{
		key: "initialize",
		value: function initialize(path, options) {
			var _this = this;

			this.file = new _FileLoader2.default(path, function (fileData, type, path) {

				var basePath = _this.file.getBasePath();

				if (type == _FileLoader.FileType.image) {

					(0, _ParseImage2.default)(fileData, basePath, function () {});
				} else if (type == _FileLoader.FileType.obj) {

					(0, _ParseOBJ2.default)(fileData, basePath, function () {});
				} else if (type == _FileLoader.FileType.mtl) {} else if (type == _FileLoader.FileType.json) {

					(0, _ParseJSON2.default)(fileData, basePath, function () {});
				};
			}, function (error) {

				console.log("NOOOO", error);
			});

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

},{"./components/FileLoader.js":4,"./methods/ParseImage.js":12,"./methods/ParseJSON.js":13,"./methods/ParseOBJ.js":15}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LetterLibrary = exports.LetterLibrary = "/\\abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@-—_.#0123456789";

var Dictionary = function () {
	function Dictionary(source) {
		_classCallCheck(this, Dictionary);

		return this.initialize(source);
	}

	_createClass(Dictionary, [{
		key: "initialize",
		value: function initialize(source) {

			this.letters = new Array();

			if (typeof source == "string") {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {

					for (var _iterator = source[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _letter = _step.value;


						this.letters.push(LetterLibrary.indexOf(_letter));
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				;
			} else if (source instanceof Array) {

				this.letters = source.slice(0);
			};

			return this;
		}
	}, {
		key: "toString",
		value: function toString() {

			var string = "";

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.letters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _letter2 = _step2.value;


					string += LetterLibrary[_letter2];
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			;

			return letter;
		}
	}]);

	return Dictionary;
}();

exports.default = Dictionary;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Face = function () {
	function Face(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC) {
		_classCallCheck(this, Face);

		return this.initialize(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);
	}

	_createClass(Face, [{
		key: "initialize",
		value: function initialize(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC) {

			this.vertexA = parseInt(vertexA) - 1;
			this.vertexB = parseInt(vertexB) - 1;
			this.vertexC = parseInt(vertexC) - 1;

			this.normalA = parseInt(normalA) - 1;
			this.normalB = parseInt(normalB) - 1;
			this.normalC = parseInt(normalC) - 1;

			this.textureA = parseInt(textureA) - 1;
			this.textureB = parseInt(textureB) - 1;
			this.textureC = parseInt(textureC) - 1;

			return this;
		}
	}]);

	return Face;
}();

exports.default = Face;
;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileType = exports.FileType = {
	image: 0,
	obj: 1,
	mtl: 2,
	json: 3,
	text: 4
};

var FileLoader = function () {
	function FileLoader(path, onComplete, onFail) {
		_classCallCheck(this, FileLoader);

		return this.initialize(path, onComplete, onFail);
	}

	_createClass(FileLoader, [{
		key: "initialize",
		value: function initialize(path, onComplete, onFail) {

			this.path = path;

			if (/\.(png|jpe?g|gif|bmp)$/.test(this.path)) {

				this.type = FileType.image;

				this.content = FileLoader.loadImage.call(this, this.path, onComplete, onFail);
			} else if (/\.obj$/g.test(this.path)) {

				this.type = FileType.obj;

				this.content = FileLoader.loadText.call(this, this.path, onComplete, onFail);
			} else if (/\.mtl$/g.test(this.path)) {

				this.type = FileType.mtl;

				this.content = FileLoader.loadText.call(this, this.path, onComplete, onFail);
			} else if (/\.json$/g.test(this.path)) {

				this.type = FileType.json;

				this.content = FileLoader.loadText.call(this, this.path, function (data, type) {

					onComplete(JSON.parse(data), type, path);
				}, onFail);
			};

			return this;
		}
	}, {
		key: "getBasePath",
		value: function getBasePath() {

			return this.path.split(/\//).slice(0, -1).join("/");
		}
	}]);

	return FileLoader;
}();

exports.default = FileLoader;
;

FileLoader.loadImage = function FileLoaderLoadImage(path, onComplete, onFail) {
	var _this = this;

	var image = new Image();

	image.addEventListener("load", function () {

		onComplete(image, _this.type || FileType.image, path);
	}, false);

	image.addEventListener("error", function () {

		onFail();
	}, false);

	image.src = path;

	return null;
};

FileLoader.loadText = function FileLoaderLoadText(path, onComplete, onFail) {
	var _this2 = this;

	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", function (event) {

		if (event.target.readyState == XMLHttpRequest.UNSEND) {} else if (event.target.readyState == XMLHttpRequest.OPENED) {} else if (event.target.readyState == XMLHttpRequest.HEADERS_RECEIVED) {} else if (event.target.readyState == XMLHttpRequest.LOADING) {} else if (event.target.readyState == XMLHttpRequest.DONE) {

			if (event.target.status >= 200 && event.target.status < 400) {

				onComplete(event.target.responseText, _this2.type || FileType.TEXT, path);
			} else if (event.target.status >= 400) {

				onFail();
			};
		}
	}, false);

	request.open("GET", path, true);

	request.send(null);

	return null;
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChannelType = exports.ChannelType = {
	rgb: 0,
	r: 1,
	g: 2,
	b: 3
};

var SideType = exports.SideType = {
	front: 0,
	back: 1,
	double: 2
};

var Material = function () {
	function Material(name) {
		_classCallCheck(this, Material);

		return this.initialize(name);
	}

	_createClass(Material, [{
		key: "initialize",
		value: function initialize(name) {

			this.setName(name);

			this.setSmooth(true);

			this.setIllumination(2);

			this.ambient = {
				red: 1,
				green: 1,
				blue: 1,
				map: null,
				clamp: false,
				channel: ChannelType.rgb
			};

			this.diffuse = {
				red: 1,
				green: 1,
				blue: 1,
				map: null,
				clamp: false,
				channel: ChannelType.rgb
			};

			this.specular = {
				red: 1,
				green: 1,
				blue: 1,
				map: null,
				clamp: false,
				channel: ChannelType.rgb
			};

			this.specularForce = {
				value: 1,
				map: null,
				clamp: false,
				channel: ChannelType.rgb
			};

			this.opacity = {
				value: 1,
				map: null,
				clamp: false,
				channel: ChannelType.rgb
			};

			this.environement = {
				reflectivity: 0,
				map: null,
				clamp: false,
				channel: ChannelType.rgb
			};

			this.shader = {
				side: SideType.front,
				depthTest: true,
				depthWrite: true,
				vertex: null,
				fragment: null
			};

			return this;
		}
	}, {
		key: "setName",
		value: function setName() {
			var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


			this.name = name;

			return this;
		}
	}, {
		key: "setSmooth",
		value: function setSmooth() {
			var smooth = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];


			this.smooth = smooth == true || parseInt(smooth) == 1 || smooth == "on" ? true : false;

			return this;
		}
	}, {
		key: "setIllumination",
		value: function setIllumination() {
			var illumination = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];


			this.illumination = parseInt(illumination);

			return this;
		}
	}, {
		key: "setAmbientColor",
		value: function setAmbientColor() {
			var red = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
			var green = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
			var blue = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];


			this.ambient.red = parseFloat(red);
			this.ambient.green = parseFloat(green);
			this.ambient.blue = parseFloat(blue);

			return this;
		}
	}, {
		key: "setDiffuseColor",
		value: function setDiffuseColor() {
			var red = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
			var green = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
			var blue = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];


			this.diffuse.red = parseFloat(red);
			this.diffuse.green = parseFloat(green);
			this.diffuse.blue = parseFloat(blue);

			return this;
		}
	}, {
		key: "setSpecularColor",
		value: function setSpecularColor() {
			var red = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
			var green = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
			var blue = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];


			this.specular.red = parseFloat(red);
			this.specular.green = parseFloat(green);
			this.specular.blue = parseFloat(blue);

			return this;
		}
	}, {
		key: "setSpecularForce",
		value: function setSpecularForce() {
			var force = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];


			this.specular.force = parseFloat(force);

			return this;
		}
	}, {
		key: "setOpacity",
		value: function setOpacity() {
			var opacity = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];


			this.opacity.value = opacity;

			return this;
		}
	}, {
		key: "setOpacityTest",
		value: function setOpacityTest() {
			var test = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];


			this.opacity.test = test;

			return this;
		}
	}, {
		key: "setEnvironementReflectivity",
		value: function setEnvironementReflectivity() {
			var reflectivity = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];


			this.environement.reflectivity = reflectivity;

			return this;
		}
	}, {
		key: "setMap",
		value: function setMap(map) {
			var path = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];


			if (this[map] != undefined) {

				this[map].map = path;
			};

			return this;
		}
	}, {
		key: "setMapClamp",
		value: function setMapClamp(map) {
			var clamp = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];


			if (this[map] != undefined) {

				this[map].clamp = clamp == true || parseInt(clamp) == 1 || clamp == "on";
			};

			return this;
		}
	}, {
		key: "setMapChannel",
		value: function setMapChannel(map) {
			var channel = arguments.length <= 1 || arguments[1] === undefined ? "rgb" : arguments[1];


			if (this[map] != undefined) {

				this[map].channel = ChannelType[channel];
			};

			return this;
		}
	}, {
		key: "setShaderSide",
		value: function setShaderSide() {
			var side = arguments.length <= 0 || arguments[0] === undefined ? "front" : arguments[0];


			this.shader.side = side;

			return this;
		}
	}, {
		key: "setShaderDepthTest",
		value: function setShaderDepthTest() {
			var depthTest = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];


			this.shader.depthTest = depthTest == true || parseInt(depthTest) == 1 || depthTest == "on";
		}
	}, {
		key: "setShaderDepthWrite",
		value: function setShaderDepthWrite() {
			var depthWrite = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];


			this.shader.depthWrite = depthWrite == true || parseInt(depthWrite) == 1 || depthWrite == "on";
		}
	}, {
		key: "setShaderVertex",
		value: function setShaderVertex() {
			var path = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


			this.shader.vertex = path;

			return this;
		}
	}, {
		key: "setShaderFragment",
		value: function setShaderFragment() {
			var path = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


			this.shader.fragment = path;

			return this;
		}
	}]);

	return Material;
}();

exports.default = Material;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Material = require("./Material.js");

var _Material2 = _interopRequireDefault(_Material);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MaterialLibrary = function () {
	function MaterialLibrary() {
		_classCallCheck(this, MaterialLibrary);

		this.materials = new Array();

		this.initialize();
	}

	_createClass(MaterialLibrary, [{
		key: "initialize",
		value: function initialize() {

			this.materials = new Array();

			this.addMaterial(null);

			this.materials[this.materials.length - 1].default = true;

			return this;
		}
	}, {
		key: "addMaterial",
		value: function addMaterial(name) {

			if (this.materials[this.materials.length - 1] && this.materials[this.materials.length - 1].default == true) {

				delete this.materials[this.materials.length - 1].default;

				this.materials[this.materials.length - 1].setName(name);
			} else {

				this.materials.push(new _Material2.default(name));
			};

			return this;
		}
	}, {
		key: "getMaterial",
		value: function getMaterial(name) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {

				for (var _iterator = this.materials[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var material = _step.value;


					if (material.name == name) {

						return material;
					};
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			;

			return null;
		}
	}, {
		key: "addSmooth",
		value: function addSmooth(smooth) {

			this.materials[this.materials.length - 1].setSmooth(smooth);

			return this;
		}
	}, {
		key: "addIllumination",
		value: function addIllumination(illumination) {

			this.materials[this.materials.length - 1].setIllumination(illumination);

			return this;
		}
	}, {
		key: "addAmbientColor",
		value: function addAmbientColor(red, green, blue) {

			this.materials[this.materials.length - 1].setAmbientColor(red, green, blue);

			return this;
		}
	}, {
		key: "addDiffuseColor",
		value: function addDiffuseColor(red, green, blue) {

			this.materials[this.materials.length - 1].setDiffuseColor(red, green, blue);

			return this;
		}
	}, {
		key: "addSpecularColor",
		value: function addSpecularColor(red, green, blue) {

			this.materials[this.materials.length - 1].setSpecularColor(red, green, blue);

			return this;
		}
	}, {
		key: "addSpecularForce",
		value: function addSpecularForce(force) {

			this.materials[this.materials.length - 1].setSpecularForce(force);

			return this;
		}
	}, {
		key: "addOpacity",
		value: function addOpacity(opacity) {

			this.materials[this.materials.length - 1].setOpacity(opacity);

			return this;
		}
	}, {
		key: "addOpacityTest",
		value: function addOpacityTest(test) {

			this.materials[this.materials.length - 1].setOpacityTest(test);

			return this;
		}
	}, {
		key: "addEnvironementReflectivity",
		value: function addEnvironementReflectivity(reflectivity) {

			this.materials[this.materials.length - 1].setEnvironementReflectivity(reflectivity);

			return this;
		}
	}, {
		key: "addMap",
		value: function addMap(map, path) {

			this.materials[this.materials.length - 1].setMap(map, path);

			return this;
		}
	}, {
		key: "addMapClamp",
		value: function addMapClamp(map, clamp) {

			this.materials[this.materials.length - 1].setMapClamp(map, clamp);

			return this;
		}
	}, {
		key: "addMapChannel",
		value: function addMapChannel(map, channel) {

			this.materials[this.materials.length - 1].setMapChannel(map, channel);

			return this;
		}
	}, {
		key: "addShaderSide",
		value: function addShaderSide(side) {

			this.materials[this.materials.length - 1].setShaderSide(side);

			return this;
		}
	}, {
		key: "addShaderDepthTest",
		value: function addShaderDepthTest(depthTest) {

			this.materials[this.materials.length - 1].setShaderDepthTest(depthTest);

			return this;
		}
	}, {
		key: "addShaderDepthWrite",
		value: function addShaderDepthWrite(depthWrite) {

			this.materials[this.materials.length - 1].setShaderDepthWrite(depthWrite);

			return this;
		}
	}, {
		key: "addShaderVertex",
		value: function addShaderVertex(path) {

			this.materials[this.materials.length - 1].setShaderVertex(path);

			return this;
		}
	}, {
		key: "addShaderFragment",
		value: function addShaderFragment(path) {

			this.materials[this.materials.length - 1].setShaderFragment(path);

			return this;
		}
	}]);

	return MaterialLibrary;
}();

exports.default = MaterialLibrary;
;

},{"./Material.js":5}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
	function Model(name) {
		_classCallCheck(this, Model);

		return this.initialize(name);
	}

	_createClass(Model, [{
		key: "initialize",
		value: function initialize(name) {

			this.groups = new Array();

			this.addGroup(null);

			this.groups[this.groups.length - 1].default = true;

			this.setName(name);

			return this;
		}
	}, {
		key: "addGroup",
		value: function addGroup(name) {

			if (this.groups[this.groups.length - 1] && this.groups[this.groups.length - 1].default == true) {

				delete this.groups[this.groups.length - 1].default;

				this.setName(name);
			} else {

				this.groups.push({
					vertices: new Array(),
					normals: new Array(),
					textures: new Array(),
					faces: new Array()
				});
			};

			return this;
		}
	}, {
		key: "setName",
		value: function setName() {
			var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


			this.groups[this.groups.length - 1].name = name;

			return this;
		}
	}, {
		key: "addVertex",
		value: function addVertex(index) {

			this.groups[this.groups.length - 1].vertices.push(index);

			return this;
		}
	}, {
		key: "addNormal",
		value: function addNormal(index) {

			this.groups[this.groups.length - 1].normals.push(index);

			return this;
		}
	}, {
		key: "addTexture",
		value: function addTexture(index) {

			this.groups[this.groups.length - 1].textures.push(index);

			return this;
		}
	}, {
		key: "addFace",
		value: function addFace(index) {

			this.groups[this.groups.length - 1].faces.push(index);

			return this;
		}
	}, {
		key: "setMaterial",
		value: function setMaterial(name) {

			this.groups[this.groups.length - 1].material = name;

			return this;
		}
	}]);

	return Model;
}();

exports.default = Model;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model = require("./Model.js");

var _Model2 = _interopRequireDefault(_Model);

var _Vertex = require("./Vertex.js");

var _Vertex2 = _interopRequireDefault(_Vertex);

var _Normal = require("./Normal.js");

var _Normal2 = _interopRequireDefault(_Normal);

var _Texture = require("./Texture.js");

var _Texture2 = _interopRequireDefault(_Texture);

var _Face = require("./Face.js");

var _Face2 = _interopRequireDefault(_Face);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelLibrary = function () {
	function ModelLibrary() {
		_classCallCheck(this, ModelLibrary);

		return this.initialize();
	}

	_createClass(ModelLibrary, [{
		key: "initialize",
		value: function initialize() {

			this.defaultObject = new _Model2.default("default");

			this.currentObject = null;

			this.materialLibrary = null;

			this.objects = new Array();

			this.vertices = new Array();

			this.normals = new Array();

			this.textures = new Array();

			this.faces = new Array();

			return this;
		}
	}, {
		key: "addObject",
		value: function addObject(name) {

			var object = new _Model2.default(name);

			this.currentObject = object;

			this.objects.push(object);

			return this;
		}
	}, {
		key: "addGroup",
		value: function addGroup(name) {

			if (this.currentObject != null) {

				this.currentObject.addGroup(name);
			} else {

				this.defaultObject.addGroup(name);
			};

			return this;
		}
	}, {
		key: "addVertex",
		value: function addVertex(x, y, z) {

			var index = this.vertices.push(new _Vertex2.default(x, y, z)) - 1;

			if (this.currentObject != null) {

				this.currentObject.addVertex(index);
			} else {

				this.defaultObject.addVertex(index);
			};

			return this;
		}
	}, {
		key: "addNormal",
		value: function addNormal(x, y, z) {

			var index = this.normals.push(new _Normal2.default(x, y, z)) - 1;

			if (this.currentObject != null) {

				this.currentObject.addNormal(index);
			} else {

				this.defaultObject.addNormal(index);
			};

			return this;
		}
	}, {
		key: "addTexture",
		value: function addTexture(u, v) {

			var index = this.textures.push(new _Texture2.default(u, v)) - 1;

			if (this.currentObject != null) {

				this.currentObject.addTexture(index);
			} else {

				this.defaultObject.addTexture(index);
			};

			return this;
		}
	}, {
		key: "addFace",
		value: function addFace(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC) {

			var index = this.faces.push(new _Face2.default(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC)) - 1;

			if (this.currentObject != null) {

				this.currentObject.addFace(index);
			} else {

				this.defaultObject.addFace(index);
			};

			return this;
		}
	}, {
		key: "setMaterialLibrary",
		value: function setMaterialLibrary(materialLibrary) {

			this.materialLibrary = materialLibrary;

			return this;
		}
	}, {
		key: "addMaterial",
		value: function addMaterial(name) {

			if (this.currentObject != null) {

				this.currentObject.setMaterial(name);
			} else {

				this.defaultObject.setMaterial(name);
			};

			return this;
		}
	}]);

	return ModelLibrary;
}();

exports.default = ModelLibrary;
;

},{"./Face.js":3,"./Model.js":7,"./Normal.js":9,"./Texture.js":10,"./Vertex.js":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Normal = function () {
	function Normal(x, y, z) {
		_classCallCheck(this, Normal);

		return this.initialize(x, y, z);
	}

	_createClass(Normal, [{
		key: "initialize",
		value: function initialize(x, y, z) {

			this.x = parseFloat(x);
			this.y = parseFloat(y);
			this.z = parseFloat(z);

			return this;
		}
	}]);

	return Normal;
}();

exports.default = Normal;
;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Texture = function () {
	function Texture(u, v) {
		_classCallCheck(this, Texture);

		return this.initialize(u, v);
	}

	_createClass(Texture, [{
		key: "initialize",
		value: function initialize(u, v) {

			this.u = parseFloat(u);
			this.v = parseFloat(v);

			return this;
		}
	}]);

	return Texture;
}();

exports.default = Texture;
;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = function () {
	function Vertex(x, y, z) {
		_classCallCheck(this, Vertex);

		return this.initialize(x, y, z);
	}

	_createClass(Vertex, [{
		key: "initialize",
		value: function initialize(x, y, z) {

			this.x = parseFloat(x);
			this.y = parseFloat(y);
			this.z = parseFloat(z);

			return this;
		}
	}]);

	return Vertex;
}();

exports.default = Vertex;
;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ParseImage;
function ParseImage(image, onComplete) {};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseJSON;
function ParseJSON(json, onComplete) {

	console.log("ParseJSON");
};

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MapType = undefined;
exports.default = ParseMTL;

var _MaterialLibrary = require("../components/MaterialLibrary.js");

var _MaterialLibrary2 = _interopRequireDefault(_MaterialLibrary);

var _Dictionary = require("../components/Dictionary.js");

var _Dictionary2 = _interopRequireDefault(_Dictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MapType = exports.MapType = {
	map_ka: "ambient",
	map_kd: "diffuse",
	map_ks: "specular",
	map_ns: "specularForce",
	map_kn: "normal",
	map_ke: "environement",
	map_bump: "bump",
	map_d: "opacity"
};

function ParseMTL(mtl, basePath, onComplete) {

	var materialLibrary = new _MaterialLibrary2.default();

	mtl.split(/\n+/).forEach(function (value, index, array) {

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0].toLowerCase();

		// console.log(info);

		if (type == "newmtl") {

			materialLibrary.addMaterial(info[1]);
		} else if (type == "s") {

			materialLibrary.addSmooth(info[1]);
		} else if (type == "illum") {

			materialLibrary.addIllumination(info[1]);
		} else if (type == "ka") {

			materialLibrary.addAmbientColor(info[1], info[2], info[3]);
		} else if (type == "kd") {

			materialLibrary.addDiffuseColor(info[1], info[2], info[3]);
		} else if (type == "ks") {

			materialLibrary.addSpecularColor(info[1], info[2], info[3]);
		} else if (type == "ns") {

			materialLibrary.addSpecularForce(info[1]);
		} else if (type == "d") {

			materialLibrary.addOpacity(info[1]);
		} else if (type == "ne") {

			materialLibrary.addEnvionementReflectivity(info[1]);
		} else if (type.substr(0, 3) == "map") {

			var mapType = MapType[type];

			var path = info.pop();

			materialLibrary.addMap(mapType, path);

			for (var optionIndex = 1, length = info.length; optionIndex < length; optionIndex++) {

				var option = info[optionIndex];

				if (option == "-clamp") {

					materialLibrary.addMapClamp(mapType, info[++optionIndex]);
				} else if (option == "-imfchan") {

					materialLibrary.addMapChannel(mapType, info[++optionIndex]);
				} else if (option == "-test") {

					materialLibrary.addOpacityTest(info[++optionIndex]);
				};
			};
		} else if (type == "shader_s") {

			materialLibrary.addShaderSide(info[1]);
		} else if (type == "shader_dt") {

			materialLibrary.addShaderDepthTest(info[1]);
		} else if (type == "shader_dw") {

			materialLibrary.addShaderDepthWrite(info[1]);
		} else if (type == "shader_v") {

			materialLibrary.addShaderVertex(info[1]);
		} else if (type == "shader_f") {

			materialLibrary.addShaderFragment(info[1]);
		};
	});

	onComplete(materialLibrary);
};

},{"../components/Dictionary.js":2,"../components/MaterialLibrary.js":6}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseOBJ;

var _ParseMTL = require("./ParseMTL.js");

var _ParseMTL2 = _interopRequireDefault(_ParseMTL);

var _ModelLibrary = require("../components/ModelLibrary.js");

var _ModelLibrary2 = _interopRequireDefault(_ModelLibrary);

var _FileLoader = require("../components/FileLoader.js");

var _FileLoader2 = _interopRequireDefault(_FileLoader);

var _MaterialLibrary = require("../components/MaterialLibrary.js");

var _MaterialLibrary2 = _interopRequireDefault(_MaterialLibrary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ParseOBJ(obj, basePath, onComplete) {

	var model = new _ModelLibrary2.default();

	var parseOBJComplete = false;
	var parseMTLComplete = true;

	obj.split(/\n+/).forEach(function (value, index, array) {

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0];

		if (type == "o") {

			model.addObject(info[1]);
		} else if (type == "g") {

			model.addGroup(info[1]);
		} else if (type == "v") {

			var x = info[1];
			var y = info[2];
			var z = info[3];

			model.addVertex(x, y, z);
		} else if (type == "vn") {

			var x = info[1];
			var y = info[2];
			var z = info[3];

			model.addNormal(x, y, z);
		} else if (type == "vt") {

			var u = info[1];
			var v = info[2];

			model.addTexture(u, v);
		} else if (type == "f") {

			var a = info[1].split(/\//);
			var b = info[2].split(/\//);
			var c = info[3].split(/\//);

			var vertexA = a[0];
			var vertexB = b[0];
			var vertexC = c[0];

			var normalA = a[1];
			var normalB = b[1];
			var normalC = c[1];

			var textureA = a[1];
			var textureB = b[1];
			var textureC = c[1];

			model.addFace(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);
		} else if (type == "mtllib") {

			parseMTLComplete = false;

			var materialLibraryPath = basePath + "/" + info[1];

			var file = new _FileLoader2.default(materialLibraryPath, function (fileData, type, path) {

				(0, _ParseMTL2.default)(fileData, file.getBasePath(), function (materialLibrary) {

					parseMTLComplete = true;

					model.setMaterialLibrary(materialLibrary);

					if (parseOBJComplete == true && parseMTLComplete == true) {

						console.log("FINISH", model);
					};
				});
			});
		} else if (type == "usemtl") {

			model.addMaterial(info[1]);
		};
	});

	parseOBJComplete = true;

	if (parseOBJComplete == true && parseMTLComplete == true) {

		console.log("FINISH", model);
	};
};

},{"../components/FileLoader.js":4,"../components/MaterialLibrary.js":6,"../components/ModelLibrary.js":8,"./ParseMTL.js":14}]},{},[1])(1)
});