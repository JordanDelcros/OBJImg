(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.OBJImage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.THREE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FileLoader = require("./components/FileLoader.js");

var _FileLoader2 = _interopRequireDefault(_FileLoader);

var _MeshGenerator = require("./components/MeshGenerator.js");

var _MeshGenerator2 = _interopRequireDefault(_MeshGenerator);

var _ImageGenerator = require("./components/ImageGenerator.js");

var _ImageGenerator2 = _interopRequireDefault(_ImageGenerator);

var _ParseImage = require("./methods/ParseImage.js");

var _ParseImage2 = _interopRequireDefault(_ParseImage);

var _ParseOBJ = require("./methods/ParseOBJ.js");

var _ParseOBJ2 = _interopRequireDefault(_ParseOBJ);

var _ParseJSON = require("./methods/ParseJSON.js");

var _ParseJSON2 = _interopRequireDefault(_ParseJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var THREE = exports.THREE = null;

var OBJImage = function () {
	function OBJImage(path, options) {
		_classCallCheck(this, OBJImage);

		return this.initialize(path, options);
	}

	_createClass(OBJImage, [{
		key: "initialize",
		value: function initialize(path, options) {

			new _FileLoader2.default(path).then(function (file) {

				if (options.onLoad instanceof Function) {

					options.onLoad(file);
				};

				if (file.type == _FileLoader.FileType.image) {

					(0, _ParseImage2.default)(file.data, file.basePath, function () {});
				} else if (file.type == _FileLoader.FileType.obj) {

					(0, _ParseOBJ2.default)(file.data, file.basePath, function (modelLibrary) {

						if (options.onParse instanceof Function) {

							options.onParse(modelLibrary);
						};
					});
				} else if (file.type == _FileLoader.FileType.mtl) {} else if (file.type == _FileLoader.FileType.json) {

					(0, _ParseJSON2.default)(file.data, file.basePath, function () {});
				};
			}).catch(function (error) {

				throw error;
			});

			return this;
		}
	}]);

	return OBJImage;
}();

exports.default = OBJImage;


OBJImage.version = "2.0.0";

OBJImage.defineTHREE = function (THREELibrary) {

	exports.THREE = THREE = THREELibrary;
};

OBJImage.MeshGenerator = _MeshGenerator2.default;

OBJImage.ImageGenerator = _ImageGenerator2.default;

if (typeof define !== "undefined" && define instanceof Function && define.amd !== undefined) {

	define(function () {

		return OBJImage;
	});
} else if (typeof module !== "undefined" && module.exports) {

	module.exports = OBJImage;
} else if (typeof self !== "undefined") {

	self.OBJImage = OBJImage;
};

},{"./components/FileLoader.js":5,"./components/ImageGenerator.js":6,"./components/MeshGenerator.js":9,"./methods/ParseImage.js":15,"./methods/ParseJSON.js":16,"./methods/ParseOBJ.js":18}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bounds = function () {
	function Bounds(size) {
		_classCallCheck(this, Bounds);

		return this.initialize(size);
	}

	_createClass(Bounds, [{
		key: "initialize",
		value: function initialize(size) {

			this.min = {
				x: 0,
				y: 0,
				z: 0
			};

			this.max = {
				x: 0,
				y: 0,
				z: 0
			};

			return this;
		}
	}, {
		key: "measure",
		value: function measure(x, y, z) {

			this.min.x = x < this.min.x ? x : this.min.x;
			this.min.y = y < this.min.y ? y : this.min.y;
			this.min.z = z < this.min.z ? z : this.min.z;

			this.max.x = x > this.max.x ? x : this.max.x;
			this.max.y = y > this.max.y ? y : this.max.y;
			this.max.z = z > this.max.z ? z : this.max.z;

			return this;
		}
	}, {
		key: "getSize",
		value: function getSize() {

			return {
				x: this.max.x - this.min.x,
				y: this.max.y - this.min.y,
				z: this.max.z - this.min.z
			};
		}
	}, {
		key: "getMax",
		value: function getMax() {

			return Math.max(this.max.x, this.max.y, this.max.z);
		}
	}, {
		key: "getMin",
		value: function getMin() {

			return Math.min(this.min.x, this.min.y, this.min.z);
		}
	}]);

	return Bounds;
}();

exports.default = Bounds;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
		value: function initialize(vertexA, vertexB, vertexC) {
			var normalA = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
			var normalB = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
			var normalC = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];
			var textureA = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];
			var textureB = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];
			var textureC = arguments.length <= 8 || arguments[8] === undefined ? null : arguments[8];


			this.vertexA = null || parseInt(vertexA) - 1;
			this.vertexB = null || parseInt(vertexB) - 1;
			this.vertexC = null || parseInt(vertexC) - 1;

			this.normalA = null || parseInt(normalA) - 1;
			this.normalB = null || parseInt(normalB) - 1;
			this.normalC = null || parseInt(normalC) - 1;

			this.textureA = null || parseInt(textureA) - 1;
			this.textureB = null || parseInt(textureB) - 1;
			this.textureC = null || parseInt(textureC) - 1;

			return this;
		}
	}]);

	return Face;
}();

exports.default = Face;
;

},{}],5:[function(require,module,exports){
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
	function FileLoader(path) {
		_classCallCheck(this, FileLoader);

		return this.initialize(path);
	}

	_createClass(FileLoader, [{
		key: "initialize",
		value: function initialize(path) {
			var _this = this;

			this.path = path;

			this.basePath = this.path.split(/\//).slice(0, -1).join("/") + "/";

			this.data = null;

			if (/\.(png|jpe?g|gif|bmp)$/.test(this.path)) {

				this.type = FileType.image;

				this.content = FileLoader.loadImage.call(this, this.path, function (data, type) {

					_this.data = data;

					_this.completeHandler(_this);
				}, this.errorHandler);
			} else if (/\.obj$/g.test(this.path)) {

				this.type = FileType.obj;

				this.content = FileLoader.loadText.call(this, this.path, function (data, type) {

					_this.data = data;

					_this.completeHandler(_this);
				}, this.errorHandler);
			} else if (/\.mtl$/g.test(this.path)) {

				this.type = FileType.mtl;

				this.content = FileLoader.loadText.call(this, this.path, function (data, type) {

					_this.data = data;

					_this.completeHandler(_this);
				}, this.errorHandler);
			} else if (/\.json$/g.test(this.path)) {

				this.type = FileType.json;

				this.content = FileLoader.loadText.call(this, this.path, function (data, type) {

					_this.data = JSON.parse(data);

					_this.completeHandler(_this);
				}, this.errorHandler);
			};

			return this;
		}
	}, {
		key: "catch",
		value: function _catch(callback) {

			this.errorHandler = callback || function (error) {

				throw error;
			};

			return this;
		}
	}, {
		key: "then",
		value: function then(callback) {

			this.completeHandler = callback || function (file) {

				console.info("OBJImage — FileLoader", file);
			};

			return this;
		}
	}]);

	return FileLoader;
}();

exports.default = FileLoader;
;

FileLoader.loadImage = function FileLoaderLoadImage(path, onComplete, onFail) {
	var _this2 = this;

	var image = new Image();

	image.addEventListener("load", function () {

		onComplete(image, _this2.type || FileType.image, path);
	}, false);

	image.addEventListener("error", function () {

		onFail();
	}, false);

	image.src = path;

	return null;
};

FileLoader.loadText = function FileLoaderLoadText(path, onComplete, onFail) {
	var _this3 = this;

	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", function (event) {

		if (event.target.readyState == XMLHttpRequest.UNSEND) {} else if (event.target.readyState == XMLHttpRequest.OPENED) {} else if (event.target.readyState == XMLHttpRequest.HEADERS_RECEIVED) {} else if (event.target.readyState == XMLHttpRequest.LOADING) {} else if (event.target.readyState == XMLHttpRequest.DONE) {

			if (event.target.status >= 200 && event.target.status < 400) {

				onComplete(event.target.responseText, _this3.type || FileType.TEXT, path);
			} else if (event.target.status >= 400) {

				onFail();
			};
		}
	}, false);

	request.open("GET", path, true);

	request.send(null);

	return null;
};

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.COMPRESSION = exports.SIZES = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OBJImage = require("../OBJImage.js");

var _OBJImage2 = _interopRequireDefault(_OBJImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIZES = exports.SIZES = {
	high: 255 * 255 + 255,
	max: 255 * 255 * 255 + 255
};

var COMPRESSION = exports.COMPRESSION = {
	default: 0
};

var ImageGenerator = function () {
	function ImageGenerator(modelLibrary) {
		_classCallCheck(this, ImageGenerator);

		this.pixels = new Array();

		this.modelLibrary = modelLibrary;

		this.version = _OBJImage2.default.version;

		this.compressionType = COMPRESSION.default;

		return this.initialize();
	}

	_createClass(ImageGenerator, [{
		key: "initialize",
		value: function initialize() {

			console.log("IMAGE GENERATOR");

			this.setVersion(this.version);

			this.setCompressionType(this.compressionType);

			this.verticesMultiplicator = this.addPixel(Math.floor(SIZES.max / Math.max(this.modelLibrary.bounds.getMax() + Math.abs(this.modelLibrary.bounds.getMin()), 1)));

			this.verticesLength = this.addPixel(this.modelLibrary.vertices.length);

			this.verticesPivot = this.addPixel(Math.abs(this.modelLibrary.bounds.getMin()) * this.verticesMultiplicator) / this.verticesMultiplicator;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.modelLibrary.vertices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var vertex = _step.value;


					this.addPixel((vertex.x + this.verticesPivot) * this.verticesMultiplicator);
					this.addPixel((vertex.y + this.verticesPivot) * this.verticesMultiplicator);
					this.addPixel((vertex.z + this.verticesPivot) * this.verticesMultiplicator);
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

			// STOPED HERE
			this.normalsMultiplicator = this.addPixel();

			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");

			var image = new Image();

			image.src = canvas.toDataURL();

			return image;
		}
	}, {
		key: "setVersion",
		value: function setVersion(version) {

			version = version.toString().split(/\./g);

			this.setPixel(0, parseInt(version[0]), parseInt(version[1]), parseInt(version[2]), 255);

			return version;
		}
	}, {
		key: "setCompressionType",
		value: function setCompressionType(type) {

			this.setPixel(1, type, 0, 0, 255);

			return type;
		}
	}, {
		key: "setPixel",
		value: function setPixel(index, red, green, blue, alpha) {

			this.pixels[index * 4 + 0] = red;
			this.pixels[index * 4 + 1] = green;
			this.pixels[index * 4 + 2] = blue;
			this.pixels[index * 4 + 3] = alpha;

			return this;
		}
	}, {
		key: "addPixel",
		value: function addPixel() {
			var red = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var green = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
			var blue = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
			var alpha = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];


			if (green == null && blue == null && alpha == null) {

				var value = Math.max(0, Math.min(SIZES.max, red));

				var split = Math.max(1, Math.ceil(value / SIZES.high));

				green = Math.min(Math.floor(value / split / 255), 255);
				red = green > 0 ? 255 : 0;
				blue = Math.floor(value / split - red * green);
				alpha = split;
			};

			this.pixels.push(red, green, blue, alpha);

			return (red * green + blue) * alpha;
		}
	}]);

	return ImageGenerator;
}();

exports.default = ImageGenerator;

},{"../OBJImage.js":1}],7:[function(require,module,exports){
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

			this.bump = {
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

},{}],8:[function(require,module,exports){
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

			if (typeof name == "string") {
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
			} else if (typeof name == "number") {

				return this.materials[name];
			};

			return undefined;
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

},{"./Material.js":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OBJImage = require("../OBJImage.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TRIANGLE = 3;
var VERTEX = 3;
var TEXTURE = 2;

var MeshGenerator = function () {
	function MeshGenerator(modelLibrary) {
		_classCallCheck(this, MeshGenerator);

		return this.initialize(modelLibrary);
	}

	_createClass(MeshGenerator, [{
		key: "initialize",
		value: function initialize(modelLibrary) {

			var materials = new Object();

			if (modelLibrary.materialLibrary != null) {

				var textureLoader = new _OBJImage.THREE.TextureLoader();

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = modelLibrary.materialLibrary.materials[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var material = _step.value;


						materials[material.name] = new _OBJImage.THREE.MeshPhongMaterial({
							color: new _OBJImage.THREE.Color(material.diffuse.red, material.diffuse.green, material.diffuse.blue),
							map: material.diffuse.map != null ? textureLoader.load(material.diffuse.map) : null,
							specular: new _OBJImage.THREE.Color(material.specular.red, material.specular.green, material.specular.blue),
							specularMap: material.specular.amp != null ? textureLoader.load(material.specular.map) : null,
							aoMap: material.ambient.amp != null ? textureLoader.load(material.ambient.map) : null,
							aoMapIntensity: 1,
							bumpMap: material.bump.amp != null ? textureLoader.load(material.bump.map) : null,
							shininess: material.specular.force,
							opacity: material.opacity.value,
							transparent: material.opacity.value < 1 ? true : false,
							side: _OBJImage.THREE.DoubleSide
						});
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
			};

			var objects = new _OBJImage.THREE.Object3D();

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = modelLibrary.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var object = _step2.value;


					var objectContainer = new _OBJImage.THREE.Object3D();

					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = object.groups[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var group = _step3.value;


							var geometry = new _OBJImage.THREE.BufferGeometry();

							var indices = new Uint32Array(group.faces.length * 3);

							for (var index = 0; index < indices.length; index++) {

								indices[index] = index;
							};

							var positions = new Float32Array(group.faces.length * TRIANGLE * VERTEX);

							var normals = new Float32Array(group.faces.length * TRIANGLE * VERTEX);

							var uvs = new Float32Array(group.faces.length * TRIANGLE * TEXTURE);

							for (var faceIndex = 0, faceLength = group.faces.length; faceIndex < faceLength; faceIndex++) {

								var face = modelLibrary.faces[group.faces[faceIndex]];

								var computedFaceVertexIndex = faceIndex * TRIANGLE * VERTEX;
								var computedFaceTextureIndex = faceIndex * TRIANGLE * TEXTURE;

								positions[computedFaceVertexIndex + 0] = modelLibrary.vertices[face.vertexA].x;
								positions[computedFaceVertexIndex + 1] = modelLibrary.vertices[face.vertexA].y;
								positions[computedFaceVertexIndex + 2] = modelLibrary.vertices[face.vertexA].z;

								positions[computedFaceVertexIndex + 3] = modelLibrary.vertices[face.vertexB].x;
								positions[computedFaceVertexIndex + 4] = modelLibrary.vertices[face.vertexB].y;
								positions[computedFaceVertexIndex + 5] = modelLibrary.vertices[face.vertexB].z;

								positions[computedFaceVertexIndex + 6] = modelLibrary.vertices[face.vertexC].x;
								positions[computedFaceVertexIndex + 7] = modelLibrary.vertices[face.vertexC].y;
								positions[computedFaceVertexIndex + 8] = modelLibrary.vertices[face.vertexC].z;

								if (face.normalA != null && face.normalB != null && face.normalC != null) {

									normals[computedFaceVertexIndex + 0] = modelLibrary.normals[face.normalA].x;
									normals[computedFaceVertexIndex + 1] = modelLibrary.normals[face.normalA].y;
									normals[computedFaceVertexIndex + 2] = modelLibrary.normals[face.normalA].z;

									normals[computedFaceVertexIndex + 3] = modelLibrary.normals[face.normalB].x;
									normals[computedFaceVertexIndex + 4] = modelLibrary.normals[face.normalB].y;
									normals[computedFaceVertexIndex + 5] = modelLibrary.normals[face.normalB].z;

									normals[computedFaceVertexIndex + 6] = modelLibrary.normals[face.normalC].x;
									normals[computedFaceVertexIndex + 7] = modelLibrary.normals[face.normalC].y;
									normals[computedFaceVertexIndex + 8] = modelLibrary.normals[face.normalC].z;
								};

								if (face.textureA != null && face.textureB != null && face.textureC != null) {

									uvs[computedFaceTextureIndex + 0] = modelLibrary.textures[face.textureA].u;
									uvs[computedFaceTextureIndex + 1] = modelLibrary.textures[face.textureA].v;

									uvs[computedFaceTextureIndex + 2] = modelLibrary.textures[face.textureB].u;
									uvs[computedFaceTextureIndex + 3] = modelLibrary.textures[face.textureB].v;

									uvs[computedFaceTextureIndex + 4] = modelLibrary.textures[face.textureC].u;
									uvs[computedFaceTextureIndex + 5] = modelLibrary.textures[face.textureC].v;
								};
							};

							geometry.setIndex(new _OBJImage.THREE.BufferAttribute(indices, 1));
							geometry.addAttribute("position", new _OBJImage.THREE.BufferAttribute(positions, 3));
							geometry.addAttribute("normal", new _OBJImage.THREE.BufferAttribute(normals, 3));
							geometry.addAttribute("uv", new _OBJImage.THREE.BufferAttribute(uvs, 2));

							var _material = null;

							if (group.material != null && materials[group.material] != undefined) {

								_material = materials[group.material];
							} else {

								_material = new _OBJImage.THREE.MeshPhongMaterial({
									color: Math.random() * 0xFFFFFF
								});
							};

							var mesh = new _OBJImage.THREE.Mesh(geometry, _material);

							// mesh.geometry.computeFaceNormals();
							// mesh.geometry.computeVertexNormals();

							if (group.name != null) {

								mesh.name = group.name;
							};

							objectContainer.add(mesh);
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					;

					objects.add(objectContainer);
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

			return objects;
		}
	}]);

	return MeshGenerator;
}();

exports.default = MeshGenerator;
;

},{"../OBJImage.js":1}],10:[function(require,module,exports){
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
					name: null,
					vertices: new Array(),
					normals: new Array(),
					textures: new Array(),
					faces: new Array(),
					material: null
				});
			};

			return this;
		}
	}, {
		key: "getGroup",
		value: function getGroup() {
			var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


			if (typeof name == "string") {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {

					for (var _iterator = this.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var group = _step.value;


						if (group.name == name) {

							return group;
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
			} else if (typeof name == "number") {

				return this.groups[name];
			};

			return undefined;
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

},{}],11:[function(require,module,exports){
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

var _Bounds = require("./Bounds.js");

var _Bounds2 = _interopRequireDefault(_Bounds);

var _ImageGenerator = require("./ImageGenerator.js");

var _ImageGenerator2 = _interopRequireDefault(_ImageGenerator);

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

			this.objects = new Array();

			this.vertices = new Array();

			this.normals = new Array();

			this.textures = new Array();

			this.faces = new Array();

			this.bounds = new _Bounds2.default();

			this.materialLibrary = null;

			this.addObject(null);

			this.objects[this.objects.length - 1].default = true;

			return this;
		}
	}, {
		key: "addObject",
		value: function addObject(name) {

			if (this.objects[this.objects.length - 1] && this.objects[this.objects.length - 1].default == true) {

				delete this.objects[this.objects.length - 1].default;

				this.objects[this.objects.length - 1].setName(name);
			} else {

				this.objects.push(new _Model2.default(name));
			};

			return this;
		}
	}, {
		key: "getObject",
		value: function getObject(name) {

			if (typeof name == "string") {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {

					for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var object = _step.value;


						if (object.name == name) {

							return object;
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
			} else if (typeof name == "number") {

				return this.objects[name];
			};

			return undefined;
		}
	}, {
		key: "addGroup",
		value: function addGroup(name) {

			this.objects[this.objects.length - 1].addGroup(name);

			return this;
		}
	}, {
		key: "addVertex",
		value: function addVertex(x, y, z) {

			var index = this.vertices.push(new _Vertex2.default(x, y, z)) - 1;

			this.objects[this.objects.length - 1].addVertex(index);

			this.bounds.measure("vertices", x, y, z);

			return this;
		}
	}, {
		key: "addNormal",
		value: function addNormal(x, y, z) {

			var index = this.normals.push(new _Normal2.default(x, y, z)) - 1;

			this.objects[this.objects.length - 1].addNormal(index);

			return this;
		}
	}, {
		key: "addTexture",
		value: function addTexture(u, v) {

			var index = this.textures.push(new _Texture2.default(u, v)) - 1;

			this.objects[this.objects.length - 1].addTexture(index);

			return this;
		}
	}, {
		key: "addFace",
		value: function addFace(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC) {

			var index = this.faces.push(new _Face2.default(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC)) - 1;

			this.objects[this.objects.length - 1].addFace(index);

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

			this.objects[this.objects.length - 1].setMaterial(name);

			return this;
		}
	}, {
		key: "toImage",
		value: function toImage() {

			return new _ImageGenerator2.default(this);
		}
	}]);

	return ModelLibrary;
}();

exports.default = ModelLibrary;
;

},{"./Bounds.js":2,"./Face.js":4,"./ImageGenerator.js":6,"./Model.js":10,"./Normal.js":12,"./Texture.js":13,"./Vertex.js":14}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ParseImage;
function ParseImage(image, onComplete) {};

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseJSON;
function ParseJSON(json, onComplete) {

	console.log("ParseJSON");
};

},{}],17:[function(require,module,exports){
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

		if (info.length > 0) {

			var type = info[0].toLowerCase();

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

				materialLibrary.addMap(mapType, basePath + path);

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
		};
	});

	onComplete(materialLibrary);
};

},{"../components/Dictionary.js":3,"../components/MaterialLibrary.js":8}],18:[function(require,module,exports){
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

			var _x = info[1];
			var _y = info[2];
			var _z = info[3];

			model.addNormal(_x, _y, _z);
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

			var textureA = a[1];
			var textureB = b[1];
			var textureC = c[1];

			var normalA = a[2];
			var normalB = b[2];
			var normalC = c[2];

			model.addFace(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC);
		} else if (type == "mtllib") {

			parseMTLComplete = false;

			var materialLibraryPath = basePath + info[1];

			new _FileLoader2.default(materialLibraryPath).then(function (file) {

				(0, _ParseMTL2.default)(file.data, file.basePath, function (materialLibrary) {

					parseMTLComplete = true;

					model.setMaterialLibrary(materialLibrary);

					if (parseOBJComplete == true && parseMTLComplete == true) {

						onComplete(model);
					};
				});
			}).catch(function (error) {

				throw error;
			});
		} else if (type == "usemtl") {

			model.addMaterial(info[1]);
		};
	});

	parseOBJComplete = true;

	if (parseOBJComplete == true && parseMTLComplete == true) {

		onComplete(model);
	};
};

},{"../components/FileLoader.js":5,"../components/MaterialLibrary.js":8,"../components/ModelLibrary.js":11,"./ParseMTL.js":17}]},{},[1])(1)
});