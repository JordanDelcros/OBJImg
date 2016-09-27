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

					(0, _ParseImage2.default)(file.data, file.basePath, function (modelLibrary) {

						// if( options.onParse instanceof Function ){

						// 	options.onParse(modelLibrary);

						// };

					});
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


OBJImage.version = {
	major: 2,
	minor: 0,
	patch: 0
};

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

},{"./components/FileLoader.js":5,"./components/ImageGenerator.js":6,"./components/MeshGenerator.js":10,"./methods/ParseImage.js":16,"./methods/ParseJSON.js":17,"./methods/ParseOBJ.js":19}],2:[function(require,module,exports){
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
				x: -0,
				y: -0,
				z: -0
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

			x = parseFloat(x);
			y = parseFloat(y);
			z = parseFloat(z);

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LetterLibrary = exports.LetterLibrary = "/\\abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@-_—,.#0123456789";

var Dictionary = function () {
	function Dictionary(source) {
		_classCallCheck(this, Dictionary);

		return this.initialize(source);
	}

	_createClass(Dictionary, [{
		key: "initialize",
		value: function initialize(source) {

			this.letters = new Array();

			this.add(source);

			return this;
		}
	}, {
		key: "add",
		value: function add(elements) {

			if (typeof elements == "string") {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {

					for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var letter = _step.value;


						this.letters.push(LetterLibrary.indexOf(letter));
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
			} else if (typeof elements == "number") {

				this.letters.push(elements);
			} else if (elements instanceof Array) {
				var _letters;

				(_letters = this.letters).push.apply(_letters, _toConsumableArray(elements.slice(0)));
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
					var letter = _step2.value;


					string += LetterLibrary[letter];
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

			return string;
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

			if (path instanceof Image) {

				this.skipLoading = true;

				this.type = FileType.image;

				this.path = path.src;

				this.data = path;
			} else {

				this.path = path;

				this.basePath = this.path.split(/\//).slice(0, -1).join("/") + "/";

				this.data = null;

				if (/\.(png|jpe?g|gif|bmp)$/.test(this.path)) {

					this.type = FileType.image;

					FileLoader.loadImage.call(this, this.path, function (data, type) {

						_this.data = data;

						_this.completeHandler(_this);
					}, this.errorHandler);
				} else if (/\.obj$/g.test(this.path)) {

					this.type = FileType.obj;

					FileLoader.loadText.call(this, this.path, function (data, type) {

						_this.data = data;

						_this.completeHandler(_this);
					}, this.errorHandler);
				} else if (/\.mtl$/g.test(this.path)) {

					this.type = FileType.mtl;

					FileLoader.loadText.call(this, this.path, function (data, type) {

						_this.data = data;

						_this.completeHandler(_this);
					}, this.errorHandler);
				} else if (/\.json$/g.test(this.path)) {

					this.type = FileType.json;

					FileLoader.loadText.call(this, this.path, function (data, type) {

						_this.data = JSON.parse(data);

						_this.completeHandler(_this);
					}, this.errorHandler);
				};
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

			if (this.skipLoading == true) {

				this.completeHandler(this);
			};

			return this;
		}
	}]);

	return FileLoader;
}();

exports.default = FileLoader;
;

FileLoader.loadImage = function ImageFileLoader(path, onComplete, onFail) {
	var _this2 = this;

	var image = new Image();

	image.addEventListener("load", function () {

		onComplete(image, _this2.type || FileType.image, path);
	}, false);

	image.addEventListener("error", function () {

		onFail();
	}, false);

	image.src = path;

	return image;
};

FileLoader.loadText = function TextFileLoader(path, onComplete, onFail) {
	var _this3 = this;

	var request = new XMLHttpRequest();

	var text = new String();

	request.addEventListener("readystatechange", function (event) {

		if (event.target.readyState == XMLHttpRequest.UNSEND) {} else if (event.target.readyState == XMLHttpRequest.OPENED) {} else if (event.target.readyState == XMLHttpRequest.HEADERS_RECEIVED) {} else if (event.target.readyState == XMLHttpRequest.LOADING) {} else if (event.target.readyState == XMLHttpRequest.DONE) {

			if (event.target.status >= 200 && event.target.status < 400) {

				text += event.target.responseText;

				onComplete(text, _this3.type || FileType.TEXT, path);
			} else if (event.target.status >= 400) {

				onFail();
			};
		}
	}, false);

	request.open("GET", path, true);

	request.send(null);

	return text;
};

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CompressionType = exports.Max = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OBJImage = require("../OBJImage.js");

var _OBJImage2 = _interopRequireDefault(_OBJImage);

var _Dictionary = require("./Dictionary.js");

var _Dictionary2 = _interopRequireDefault(_Dictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Max = exports.Max = 255 * 255 + 255;

var CompressionType = exports.CompressionType = {
	default: 0
};

var ImageGenerator = function () {
	function ImageGenerator(modelLibrary) {
		_classCallCheck(this, ImageGenerator);

		this.pixels = new Array();

		this.modelLibrary = modelLibrary;

		this.compressionType = CompressionType.default;

		return this.initialize();
	}

	_createClass(ImageGenerator, [{
		key: "initialize",
		value: function initialize() {

			this.addPixel(1, _OBJImage2.default.version.major, _OBJImage2.default.version.minor, _OBJImage2.default.version.patch, 255);

			this.addPixel(1, this.compressionType);

			var verticesCountSplitting = Math.ceil(this.modelLibrary.vertices.length / Max);

			var verticesPivot = Math.abs(this.modelLibrary.bounds.getMin());

			var verticesMultiplicator = Math.floor(Max / Math.max(this.modelLibrary.bounds.getMax() + Math.abs(this.modelLibrary.bounds.getMin()), 1));

			this.addPixel(1, verticesMultiplicator);

			this.addPixel(1, verticesPivot * verticesMultiplicator);

			this.addPixel(1, verticesCountSplitting);

			this.addPixel(verticesCountSplitting, this.modelLibrary.vertices.length);

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.modelLibrary.vertices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var vertex = _step.value;


					this.addPixel(1, (vertex.x + verticesPivot) * verticesMultiplicator);
					this.addPixel(1, (vertex.y + verticesPivot) * verticesMultiplicator);
					this.addPixel(1, (vertex.z + verticesPivot) * verticesMultiplicator);
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

			var normalsMultiplicator = Math.floor(Max / 2);

			var normalsCountSplitting = Math.ceil(this.modelLibrary.normals.length / Max);

			this.addPixel(1, normalsCountSplitting);

			this.addPixel(normalsCountSplitting, this.modelLibrary.normals.length);

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.modelLibrary.normals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var normal = _step2.value;


					this.addPixel(1, (normal.x + 1) * normalsMultiplicator);
					this.addPixel(1, (normal.y + 1) * normalsMultiplicator);
					this.addPixel(1, (normal.z + 1) * normalsMultiplicator);
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

			var texturesCountSplitting = Math.ceil(this.modelLibrary.textures.length / Max);

			this.addPixel(1, texturesCountSplitting);

			this.addPixel(texturesCountSplitting, this.modelLibrary.textures.length);

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.modelLibrary.textures[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var texture = _step3.value;


					this.addPixel(1, texture.u % 1 * Max);
					this.addPixel(1, texture.v % 1 * Max);
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

			var facesCountSplitting = Math.ceil(this.modelLibrary.faces.length / Max);

			this.addPixel(1, facesCountSplitting);

			this.addPixel(facesCountSplitting, this.modelLibrary.faces.length);

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.modelLibrary.faces[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var face = _step4.value;


					this.addPixel(verticesCountSplitting, face.vertexA);
					this.addPixel(verticesCountSplitting, face.vertexB);
					this.addPixel(verticesCountSplitting, face.vertexC);

					this.addPixel(normalsCountSplitting, face.normalA);
					this.addPixel(normalsCountSplitting, face.normalB);
					this.addPixel(normalsCountSplitting, face.normalC);

					this.addPixel(texturesCountSplitting, face.textureA);
					this.addPixel(texturesCountSplitting, face.textureB);
					this.addPixel(texturesCountSplitting, face.textureC);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			;

			var materialsCountSplitting = Math.ceil(this.modelLibrary.materialLibrary.materials.length / Max);

			this.addPixel(1, materialsCountSplitting);

			this.addPixel(materialsCountSplitting, this.modelLibrary.materialLibrary.materials.length);

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.modelLibrary.materialLibrary.materials[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var material = _step5.value;


					var nameDictionary = new _Dictionary2.default(material.name);

					this.addPixel(1, nameDictionary.letters.length);

					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = nameDictionary.letters[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var _letter7 = _step7.value;


							this.addPixel(1, _letter7);
						}
					} catch (err) {
						_didIteratorError7 = true;
						_iteratorError7 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion7 && _iterator7.return) {
								_iterator7.return();
							}
						} finally {
							if (_didIteratorError7) {
								throw _iteratorError7;
							}
						}
					}

					;

					this.addPixel(1, material.illumination);

					this.addPixel(1, material.smooth);

					this.addPixel(1, material.ambient.red * 255, material.ambient.green * 255, material.ambient.blue * 255, 255);

					this.addPixel(1, material.ambient.map == null ? false : true);

					if (material.ambient.map != null) {

						this.addPixel(1, material.ambient.clamp);

						this.addPixel(1, material.ambient.channel);

						var mapDictionnary = new _Dictionary2.default(material.ambient.map);

						this.addPixel(1, mapDictionnary.letters.length);

						var _iteratorNormalCompletion8 = true;
						var _didIteratorError8 = false;
						var _iteratorError8 = undefined;

						try {
							for (var _iterator8 = mapDictionnary.letters[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
								var letter = _step8.value;


								this.addPixel(1, letter);
							}
						} catch (err) {
							_didIteratorError8 = true;
							_iteratorError8 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion8 && _iterator8.return) {
									_iterator8.return();
								}
							} finally {
								if (_didIteratorError8) {
									throw _iteratorError8;
								}
							}
						}

						;
					};

					this.addPixel(1, material.diffuse.red * 255, material.diffuse.green * 255, material.diffuse.blue * 255, 255);

					this.addPixel(1, material.diffuse.map == null ? false : true);

					if (material.diffuse.map != null) {

						this.addPixel(1, material.diffuse.clamp);

						this.addPixel(1, material.diffuse.channel);

						var _mapDictionnary = new _Dictionary2.default(material.diffuse.map);

						this.addPixel(1, _mapDictionnary.letters.length);

						var _iteratorNormalCompletion9 = true;
						var _didIteratorError9 = false;
						var _iteratorError9 = undefined;

						try {
							for (var _iterator9 = _mapDictionnary.letters[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
								var _letter = _step9.value;


								this.addPixel(1, _letter);
							}
						} catch (err) {
							_didIteratorError9 = true;
							_iteratorError9 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion9 && _iterator9.return) {
									_iterator9.return();
								}
							} finally {
								if (_didIteratorError9) {
									throw _iteratorError9;
								}
							}
						}

						;
					};

					this.addPixel(1, material.bump.red * 255, material.bump.green * 255, material.bump.blue * 255, 255);

					this.addPixel(1, material.bump.map == null ? false : true);

					if (material.bump.map != null) {

						this.addPixel(1, material.bump.clamp);

						this.addPixel(1, material.bump.channel);

						var _mapDictionnary2 = new _Dictionary2.default(material.bump.map);

						this.addPixel(1, _mapDictionnary2.letters.length);

						var _iteratorNormalCompletion10 = true;
						var _didIteratorError10 = false;
						var _iteratorError10 = undefined;

						try {
							for (var _iterator10 = _mapDictionnary2.letters[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
								var _letter2 = _step10.value;


								this.addPixel(1, _letter2);
							}
						} catch (err) {
							_didIteratorError10 = true;
							_iteratorError10 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion10 && _iterator10.return) {
									_iterator10.return();
								}
							} finally {
								if (_didIteratorError10) {
									throw _iteratorError10;
								}
							}
						}

						;
					};

					this.addPixel(1, material.specular.red * 255, material.specular.green * 255, material.specular.blue * 255, 255);

					this.addPixel(1, material.specular.map == null ? false : true);

					if (material.specular.map != null) {

						this.addPixel(1, material.specular.clamp);

						this.addPixel(1, material.specular.channel);

						var _mapDictionnary3 = new _Dictionary2.default(material.specular.map);

						this.addPixel(1, _mapDictionnary3.letters.length);

						var _iteratorNormalCompletion11 = true;
						var _didIteratorError11 = false;
						var _iteratorError11 = undefined;

						try {
							for (var _iterator11 = _mapDictionnary3.letters[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
								var _letter3 = _step11.value;


								this.addPixel(1, _letter3);
							}
						} catch (err) {
							_didIteratorError11 = true;
							_iteratorError11 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion11 && _iterator11.return) {
									_iterator11.return();
								}
							} finally {
								if (_didIteratorError11) {
									throw _iteratorError11;
								}
							}
						}

						;
					};

					this.addPixel(1, material.specularForce.map == null ? false : true);

					if (material.specularForce.map != null) {

						this.addPixel(1, material.speculaForce.value * (Max / 1000));

						this.addPixel(1, material.specularForce.clamp == null ? false : true);

						this.addPixel(1, material.specularForce.channel);

						var _mapDictionnary4 = new _Dictionary2.default(material.specularForce.map);

						this.addPixel(1, _mapDictionnary4.letters.length);

						var _iteratorNormalCompletion12 = true;
						var _didIteratorError12 = false;
						var _iteratorError12 = undefined;

						try {
							for (var _iterator12 = _mapDictionnary4.letters[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
								var _letter4 = _step12.value;


								this.addPixel(1, _letter4);
							}
						} catch (err) {
							_didIteratorError12 = true;
							_iteratorError12 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion12 && _iterator12.return) {
									_iterator12.return();
								}
							} finally {
								if (_didIteratorError12) {
									throw _iteratorError12;
								}
							}
						}

						;
					};

					this.addPixel(1, material.environement.map == null ? false : true);

					if (material.environement.map != null) {

						this.addPixel(1, material.environement.reflectivity * Max);

						this.addPixel(1, material.environement.clamp == null ? false : true);

						this.addPixel(1, material.environement.channel);

						var _mapDictionnary5 = new _Dictionary2.default(material.environement.map);

						this.addPixel(1, _mapDictionnary5.letters.length);

						var _iteratorNormalCompletion13 = true;
						var _didIteratorError13 = false;
						var _iteratorError13 = undefined;

						try {
							for (var _iterator13 = _mapDictionnary5.letters[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
								var _letter5 = _step13.value;


								this.addPixel(1, _letter5);
							}
						} catch (err) {
							_didIteratorError13 = true;
							_iteratorError13 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion13 && _iterator13.return) {
									_iterator13.return();
								}
							} finally {
								if (_didIteratorError13) {
									throw _iteratorError13;
								}
							}
						}

						;
					};

					this.addPixel(1, material.opacity.map == null ? false : true);

					if (material.opacity.map != null) {

						this.addPixel(1, material.opacity.clamp == null ? false : true);

						this.addPixel(1, material.opacity.channel);

						var _mapDictionnary6 = new _Dictionary2.default(material.opacity.map);

						this.addPixel(1, _mapDictionnary6.letters.length);

						var _iteratorNormalCompletion14 = true;
						var _didIteratorError14 = false;
						var _iteratorError14 = undefined;

						try {
							for (var _iterator14 = _mapDictionnary6.letters[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
								var _letter6 = _step14.value;


								this.addPixel(1, _letter6);
							}
						} catch (err) {
							_didIteratorError14 = true;
							_iteratorError14 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion14 && _iterator14.return) {
									_iterator14.return();
								}
							} finally {
								if (_didIteratorError14) {
									throw _iteratorError14;
								}
							}
						}

						;
					};
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			;

			this.addPixel(1, this.modelLibrary.objects.length);

			console.log("OC", this.modelLibrary.objects.length);

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this.modelLibrary.objects[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var object = _step6.value;


					var objectDictionary = new _Dictionary2.default(object.name);

					this.addPixel(1, objectDictionary.letters.length);

					var _iteratorNormalCompletion15 = true;
					var _didIteratorError15 = false;
					var _iteratorError15 = undefined;

					try {
						for (var _iterator15 = objectDictionary.letters[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
							var _letter8 = _step15.value;


							this.addPixel(1, _letter8);
						}
					} catch (err) {
						_didIteratorError15 = true;
						_iteratorError15 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion15 && _iterator15.return) {
								_iterator15.return();
							}
						} finally {
							if (_didIteratorError15) {
								throw _iteratorError15;
							}
						}
					}

					;

					this.addPixel(1, object.groups.length);

					var _iteratorNormalCompletion16 = true;
					var _didIteratorError16 = false;
					var _iteratorError16 = undefined;

					try {
						for (var _iterator16 = object.groups[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
							var group = _step16.value;


							var groupDictionary = new _Dictionary2.default(group.name);

							this.addPixel(1, groupDictionary.letters.length);

							var _iteratorNormalCompletion17 = true;
							var _didIteratorError17 = false;
							var _iteratorError17 = undefined;

							try {
								for (var _iterator17 = groupDictionary.letters[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
									var _letter9 = _step17.value;


									this.addPixel(1, _letter9);
								}
							} catch (err) {
								_didIteratorError17 = true;
								_iteratorError17 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion17 && _iterator17.return) {
										_iterator17.return();
									}
								} finally {
									if (_didIteratorError17) {
										throw _iteratorError17;
									}
								}
							}

							;

							this.addPixel(1, group.vertices.length);

							var previousVertex = null;
							var vertexFastPass = false;

							var _iteratorNormalCompletion18 = true;
							var _didIteratorError18 = false;
							var _iteratorError18 = undefined;

							try {
								for (var _iterator18 = group.vertices[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
									var _vertex = _step18.value;


									if (vertexFastPass == true) {

										if (previousVertex + 1 != _vertex) {

											vertexFastPass = false;

											this.addPixel(1, _vertex);
										};
									} else if (vertexFastPass == false) {

										if (previousVertex != null && previousVertex + 1 == _vertex) {

											vertexFastPass = true;

											this.addPixel(1, 0);
										} else {

											this.addPixel(1, _vertex);
										};
									};

									previousVertex = _vertex;
								}
							} catch (err) {
								_didIteratorError18 = true;
								_iteratorError18 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion18 && _iterator18.return) {
										_iterator18.return();
									}
								} finally {
									if (_didIteratorError18) {
										throw _iteratorError18;
									}
								}
							}

							;

							var previousNormal = null;
							var normalFastPass = false;

							var _iteratorNormalCompletion19 = true;
							var _didIteratorError19 = false;
							var _iteratorError19 = undefined;

							try {
								for (var _iterator19 = group.normals[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
									var _normal = _step19.value;


									if (normalFastPass == true) {

										if (previousNormal + 1 != _normal) {

											normalFastPass = false;

											this.addPixel(1, _normal);
										};
									} else if (normalFastPass == false) {

										if (previousNormal != null && previousNormal + 1 == _normal) {

											normalFastPass = true;

											this.addPixel(1, 0);
										} else {

											this.addPixel(1, _normal);
										};
									};

									previousNormal = _normal;
								}
							} catch (err) {
								_didIteratorError19 = true;
								_iteratorError19 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion19 && _iterator19.return) {
										_iterator19.return();
									}
								} finally {
									if (_didIteratorError19) {
										throw _iteratorError19;
									}
								}
							}

							;

							var previousTexture = null;
							var textureFastPass = false;

							var _iteratorNormalCompletion20 = true;
							var _didIteratorError20 = false;
							var _iteratorError20 = undefined;

							try {
								for (var _iterator20 = group.textures[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
									var _texture = _step20.value;


									if (textureFastPass == true) {

										if (previousTexture + 1 != _texture) {

											textureFastPass = false;

											this.addPixel(1, _texture);
										};
									} else if (textureFastPass == false) {

										if (previousTexture != null && previousTexture + 1 == _texture) {

											textureFastPass = true;

											this.addPixel(1, 0);
										} else {

											this.addPixel(1, _texture);
										};
									};

									previousTexture = _texture;
								}
							} catch (err) {
								_didIteratorError20 = true;
								_iteratorError20 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion20 && _iterator20.return) {
										_iterator20.return();
									}
								} finally {
									if (_didIteratorError20) {
										throw _iteratorError20;
									}
								}
							}

							;

							var previousFace = null;
							var faceFastPass = false;

							var _iteratorNormalCompletion21 = true;
							var _didIteratorError21 = false;
							var _iteratorError21 = undefined;

							try {
								for (var _iterator21 = group.faces[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
									var _face = _step21.value;


									if (faceFastPass == true) {

										if (previousFace + 1 != _face) {

											faceFastPass = false;

											this.addPixel(1, _face);
										};
									} else if (faceFastPass == false) {

										if (previousFace != null && previousFace + 1 == _face) {

											faceFastPass = true;

											this.addPixel(1, 0);
										} else {

											this.addPixel(1, _face);
										};
									};

									previousFace = _face;
								}
							} catch (err) {
								_didIteratorError21 = true;
								_iteratorError21 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion21 && _iterator21.return) {
										_iterator21.return();
									}
								} finally {
									if (_didIteratorError21) {
										throw _iteratorError21;
									}
								}
							}

							;
						}
					} catch (err) {
						_didIteratorError16 = true;
						_iteratorError16 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion16 && _iterator16.return) {
								_iterator16.return();
							}
						} finally {
							if (_didIteratorError16) {
								throw _iteratorError16;
							}
						}
					}

					;
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			;

			var square = Math.ceil(Math.sqrt(this.pixels.length / 4));

			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");

			canvas.width = canvas.height = square;

			var imageData = new ImageData(square, square);

			imageData.data.set(this.pixels);

			window.generated = imageData.data;

			context.putImageData(imageData, 0, 0);

			var image = new Image();

			image.width = image.height = square;

			image.src = canvas.toDataURL("image/png");

			return image;
		}
	}, {
		key: "addPixel",
		value: function addPixel() {
			var splitting = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
			var red = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
			var green = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
			var blue = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
			var alpha = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];


			if (red != null && green != null && blue != null && alpha != null) {

				this.pixels.push(red, green, blue, alpha);
			} else if (red != null && green == null && blue == null) {

				if (this.compressionType == CompressionType.default) {

					var value = red;

					// let splitting = Math.max(1, Math.ceil(red / Max));

					for (var split = 0; split < splitting; split++) {

						var splittedValue = Math.max(0, Math.min(Max, value));

						green = Math.min(Math.floor(splittedValue / 255), 255);
						red = green > 0 ? 255 : 0;
						blue = Math.floor(splittedValue - red * green);

						this.pixels.push(red, green, blue, 255);

						value -= splittedValue;
					};
				};
			} else {

				throw new Error("No given pixel color data.");
			};

			return this;
		}
	}]);

	return ImageGenerator;
}();

exports.default = ImageGenerator;

},{"../OBJImage.js":1,"./Dictionary.js":3}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImageGenerator = require("./ImageGenerator.js");

var _ModelLibrary = require("../components/ModelLibrary.js");

var _ModelLibrary2 = _interopRequireDefault(_ModelLibrary);

var _Vertex = require("./Vertex.js");

var _Vertex2 = _interopRequireDefault(_Vertex);

var _Normal = require("./Normal.js");

var _Normal2 = _interopRequireDefault(_Normal);

var _Texture = require("./Texture.js");

var _Texture2 = _interopRequireDefault(_Texture);

var _Face = require("./Face.js");

var _Face2 = _interopRequireDefault(_Face);

var _Material = require("./Material.js");

var _Material2 = _interopRequireDefault(_Material);

var _Dictionary = require("./Dictionary.js");

var _Dictionary2 = _interopRequireDefault(_Dictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageReader = function () {
	function ImageReader(image) {
		_classCallCheck(this, ImageReader);

		this.pixelIndex = 0;

		return this.initialize(image);
	}

	_createClass(ImageReader, [{
		key: "initialize",
		value: function initialize(image) {

			console.log("IMAGE READER");

			var model = new _ModelLibrary2.default();

			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");

			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

			context.drawImage(image, 0, 0);

			this.pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

			// for( let pixel = 0; pixel < this.pixels.length; pixel++ ){

			// 	if( this.pixels[pixel] != window.generated[pixel] ){

			// 		console.log("DIFFERENT", pixel, this.pixels[pixel], window.generated[pixel]);
			// 		break;

			// 	};

			// };

			var version = this.getRawPixel();

			var compressionType = this.getPixel();

			var verticesMultiplicator = this.getPixel();

			var verticesPivot = this.getPixel() / verticesMultiplicator;

			var verticesCountSplitting = this.getPixel();

			var verticesCount = this.getPixel(verticesCountSplitting);

			var vertices = new Array();

			for (var vertexIndex = 0; vertexIndex < verticesCount; vertexIndex++) {

				var x = this.getPixel() / verticesMultiplicator - verticesPivot;
				var y = this.getPixel() / verticesMultiplicator - verticesPivot;
				var z = this.getPixel() / verticesMultiplicator - verticesPivot;

				vertices.push(new _Vertex2.default(x, y, z));
			};

			var normalsMultiplicator = Math.floor(_ImageGenerator.Max / 2);

			var normalsCountSplitting = this.getPixel();

			var normalsCount = this.getPixel(normalsCountSplitting);

			var normals = new Array();

			for (var normalIndex = 0; normalIndex < normalsCount; normalIndex++) {

				var _x = this.getPixel() / normalsMultiplicator - 1;
				var _y = this.getPixel() / normalsMultiplicator - 1;
				var _z = this.getPixel() / normalsMultiplicator - 1;

				normals.push(new _Normal2.default(_x, _y, _z));
			};

			var texturesCountSplitting = this.getPixel();

			var texturesCount = this.getPixel(texturesCountSplitting);

			var textures = new Array();

			for (var textureIndex = 0; textureIndex < texturesCount; textureIndex++) {

				var u = this.getPixel() / _ImageGenerator.Max;
				var v = this.getPixel() / _ImageGenerator.Max;

				textures.push(new _Texture2.default(u, v));
			};

			var facesCountSplitting = this.getPixel();

			var facesCount = this.getPixel(facesCountSplitting);

			var faces = new Array();

			for (var faceIndex = 0; faceIndex < facesCount; faceIndex++) {

				var vertexA = this.getPixel(verticesCountSplitting) + 1;
				var vertexB = this.getPixel(verticesCountSplitting) + 1;
				var vertexC = this.getPixel(verticesCountSplitting) + 1;

				var normalA = this.getPixel(normalsCountSplitting) + 1;
				var normalB = this.getPixel(normalsCountSplitting) + 1;
				var normalC = this.getPixel(normalsCountSplitting) + 1;

				var textureA = this.getPixel(texturesCountSplitting) + 1;
				var textureB = this.getPixel(texturesCountSplitting) + 1;
				var textureC = this.getPixel(texturesCountSplitting) + 1;

				faces.push(new _Face2.default(vertexA, vertexB, vertexC, normalA, normalB, normalC, textureA, textureB, textureC));
			};

			var materialsCountSplitting = this.getPixel();

			var materialsCount = this.getPixel(materialsCountSplitting);

			var materials = new Array();

			for (var materialIndex = 0; materialIndex < materialsCount; materialIndex++) {

				var material = new _Material2.default();

				var nameLettersCount = this.getPixel();

				var nameDictionary = new _Dictionary2.default();

				for (var nameLetter = 0; nameLetter < nameLettersCount; nameLetter++) {

					nameDictionary.add(this.getPixel());
				};

				material.setName(nameDictionary.toString());

				material.setIllumination(this.getPixel());

				material.setSmooth(this.getPixel());

				var ambientColor = this.getRawPixel();

				material.setAmbientColor(ambientColor.red / _ImageGenerator.Max, ambientColor.green / _ImageGenerator.Max, ambientColor.blue / _ImageGenerator.Max);

				var hasAmbientMap = this.getPixel() == 1 ? true : false;

				if (hasAmbientMap == true) {

					material.setMapClamp("ambient", this.getPixel());

					material.setMapChannel("ambient", this.getPixel());

					var mapLettersCount = this.getPixel();

					var mapDictionary = new _Dictionary2.default();

					for (var mapLetter = 0; mapLetter < mapLettersCount; mapLetter++) {

						mapDictionary.add(this.getPixel());
					};

					material.setMap("ambient", mapDictionary.toString());
				};

				var diffuseColor = this.getRawPixel();

				material.setDiffuseColor(diffuseColor.red / _ImageGenerator.Max, diffuseColor.green / _ImageGenerator.Max, diffuseColor.blue / _ImageGenerator.Max);

				var hasDiffuseMap = this.getPixel() == 1 ? true : false;

				if (hasDiffuseMap == true) {

					material.setMapClamp("diffuse", this.getPixel());

					material.setMapChannel("diffuse", this.getPixel());

					var _mapLettersCount = this.getPixel();

					var _mapDictionary = new _Dictionary2.default();

					for (var _mapLetter = 0; _mapLetter < _mapLettersCount; _mapLetter++) {

						_mapDictionary.add(this.getPixel());
					};

					material.setMap("diffuse", _mapDictionary.toString());
				};

				var bumpColor = this.getRawPixel();

				material.setBumpColor(bumpColor.red / _ImageGenerator.Max, bumpColor.green / _ImageGenerator.Max, bumpColor.blue / _ImageGenerator.Max);

				var hasBumpMap = this.getPixel() == 1 ? true : false;

				if (hasBumpMap == true) {

					material.setMapClamp("bump", this.getPixel());

					material.setMapChannel("bump", this.getPixel());

					var _mapLettersCount2 = this.getPixel();

					var _mapDictionary2 = new _Dictionary2.default();

					for (var _mapLetter2 = 0; _mapLetter2 < _mapLettersCount2; _mapLetter2++) {

						_mapDictionary2.add(this.getPixel());
					};

					material.setMap("bump", _mapDictionary2.toString());
				};

				var specularColor = this.getRawPixel();

				material.setSpecularColor(specularColor.red / _ImageGenerator.Max, specularColor.green / _ImageGenerator.Max, specularColor.blue / _ImageGenerator.Max);

				var hasSpecularMap = this.getPixel() == 1 ? true : false;

				if (hasSpecularMap == true) {

					material.setMapClamp("specular", this.getPixel());

					material.setMapChannel("specular", this.getPixel());

					var _mapLettersCount3 = this.getPixel();

					var _mapDictionary3 = new _Dictionary2.default();

					for (var _mapLetter3 = 0; _mapLetter3 < _mapLettersCount3; _mapLetter3++) {

						_mapDictionary3.add(this.getPixel());
					};

					material.setMap("specular", _mapDictionary3.toString());
				};

				var hasSpecularForceMap = this.getPixel() == 1 ? true : false;

				if (hasSpecularForceMap == true) {

					material.setSpecularForce(this.getPixel() / (_ImageGenerator.Max / 1000));

					material.setMapClamp("specularForce", this.getPixel());

					material.setMapChannel("specularForce", this.getPixel());

					var _mapLettersCount4 = this.getPixel();

					var _mapDictionary4 = new _Dictionary2.default();

					for (var _mapLetter4 = 0; _mapLetter4 < _mapLettersCount4; _mapLetter4++) {

						_mapDictionary4.add(this.getPixel());
					};

					material.setMap("specularForce", _mapDictionary4.toString());
				};

				var hasEnvironementMap = this.getPixel() == 1 ? true : false;

				if (hasEnvironementMap == true) {

					material.setEnvironementReflectivity(this.getPixel() / _ImageGenerator.Max);

					material.setMapClamp("environement", this.getPixel());

					material.setMapChannel("environement", this.getPixel());

					var _mapLettersCount5 = this.getPixel();

					var _mapDictionary5 = new _Dictionary2.default();

					for (var _mapLetter5 = 0; _mapLetter5 < _mapLettersCount5; _mapLetter5++) {

						_mapDictionary5.add(this.getPixel());
					};

					material.setMap("environement", _mapDictionary5.toString());
				};

				var hasOpacityMap = this.getPixel() == 1 ? true : false;

				if (hasOpacityMap == true) {

					material.setMapClamp("opacity", this.getPixel());

					material.setMapChannel("opacity", this.getPixel());

					var _mapLettersCount6 = this.getPixel();

					var _mapDictionary6 = new _Dictionary2.default();

					for (var _mapLetter6 = 0; _mapLetter6 < _mapLettersCount6; _mapLetter6++) {

						_mapDictionary6.add(this.getPixel());
					};

					material.setMap("opacity", _mapDictionary6.toString());
				};

				materials.push(material);
			};

			var objectsCount = this.getPixel();

			var objects = new Array();

			for (var objectIndex = 0; objectIndex < objectsCount; objectIndex++) {

				var object = objects.push();
			};

			console.log("oc", objectsCount);

			return this;
		}
	}, {
		key: "getRawPixel",
		value: function getRawPixel() {

			var red = this.pixels[this.pixelIndex * 4 + 0];
			var green = this.pixels[this.pixelIndex * 4 + 1];
			var blue = this.pixels[this.pixelIndex * 4 + 2];
			var alpha = this.pixels[this.pixelIndex * 4 + 3];

			this.pixelIndex++;

			return { red: red, green: green, blue: blue, alpha: alpha };
		}
	}, {
		key: "getPixel",
		value: function getPixel() {
			var groupLength = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];


			var result = 0;

			for (var group = 0; group < groupLength; group++) {

				var pixel = this.getRawPixel();

				result += pixel.red * pixel.green + pixel.blue;
			};

			return result;
		}
	}]);

	return ImageReader;
}();

exports.default = ImageReader;

},{"../components/ModelLibrary.js":12,"./Dictionary.js":3,"./Face.js":4,"./ImageGenerator.js":6,"./Material.js":8,"./Normal.js":13,"./Texture.js":14,"./Vertex.js":15}],8:[function(require,module,exports){
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
		key: "setBumpColor",
		value: function setBumpColor() {
			var red = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
			var green = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
			var blue = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];


			this.bump.red = parseFloat(red);
			this.bump.green = parseFloat(green);
			this.bump.blue = parseFloat(blue);

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


			this.specularForce.value = parseFloat(force);

			return this;
		}
	}, {
		key: "setOpacity",
		value: function setOpacity() {
			var opacity = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];


			this.opacity.value = parseFloat(opacity);

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

				this[map].clamp = clamp == true || parseInt(clamp) == 1 || clamp == "on" ? true : false;
			};

			return this;
		}
	}, {
		key: "setMapChannel",
		value: function setMapChannel(map) {
			var channel = arguments.length <= 1 || arguments[1] === undefined ? "rgb" : arguments[1];


			if (this[map] != undefined) {

				if (typeof channel == "string") {

					this[map].channel = ChannelType[channel];
				} else {

					this[map].channel = channel;
				};
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

},{}],9:[function(require,module,exports){
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

},{"./Material.js":8}],10:[function(require,module,exports){
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
							shininess: material.specularForce.value,
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

},{"../OBJImage.js":1}],11:[function(require,module,exports){
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
		value: function initialize() {
			var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


			this.name = name;

			this.groups = new Array();

			this.addGroup(null);

			this.groups[this.groups.length - 1].default = true;

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

},{}],12:[function(require,module,exports){
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

			this.bounds = new _Bounds2.default();

			this.normals = new Array();

			this.textures = new Array();

			this.faces = new Array();

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

				this.objects[this.objects.length - 1].name = name;
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

			this.bounds.measure(x, y, z);

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

},{"./Bounds.js":2,"./Face.js":4,"./ImageGenerator.js":6,"./Model.js":11,"./Normal.js":13,"./Texture.js":14,"./Vertex.js":15}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseImage;

var _ImageReader = require("../components/ImageReader.js");

var _ImageReader2 = _interopRequireDefault(_ImageReader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ParseImage(image, basePath, onComplete) {

	console.log("PARSE IMAGE");

	var model = new _ImageReader2.default(image);

	onComplete(model);
};

},{"../components/ImageReader.js":7}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseJSON;
function ParseJSON(json, onComplete) {

	console.log("ParseJSON");
};

},{}],18:[function(require,module,exports){
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

},{"../components/Dictionary.js":3,"../components/MaterialLibrary.js":9}],19:[function(require,module,exports){
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

},{"../components/FileLoader.js":5,"../components/MaterialLibrary.js":9,"../components/ModelLibrary.js":12,"./ParseMTL.js":18}]},{},[1])(1)
});