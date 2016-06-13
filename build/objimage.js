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

				if (type == _FileLoader.FileType.IMAGE) {

					(0, _ParseImage2.default)(fileData, basePath, function () {});
				} else if (type == _FileLoader.FileType.OBJ) {

					(0, _ParseOBJ2.default)(fileData, basePath, function () {});
				} else if (type == _FileLoader.FileType.MTL) {} else if (type == _FileLoader.FileType.JSON) {

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

},{"./components/FileLoader.js":3,"./methods/ParseImage.js":11,"./methods/ParseJSON.js":12,"./methods/ParseOBJ.js":14}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileType = exports.FileType = {
	IMAGE: 0,
	OBJ: 1,
	MTL: 2,
	JSON: 3,
	TEXT: 4
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

				this.type = FileType.IMAGE;

				this.content = FileLoader.loadImage.call(this, this.path, onComplete, onFail);
			} else if (/\.obj$/g.test(this.path)) {

				this.type = FileType.OBJ;

				this.content = FileLoader.loadText.call(this, this.path, onComplete, onFail);
			} else if (/\.mtl$/g.test(this.path)) {

				this.type = FileType.MTL;

				this.content = FileLoader.loadText.call(this, this.path, onComplete, onFail);
			} else if (/\.json$/g.test(this.path)) {

				this.type = FileType.JSON;

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

		onComplete(image, _this.type || FileType.IMAGE, path);
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

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Material = function () {
	function Material(name) {
		_classCallCheck(this, Material);

		return this.initialize(name);
	}

	_createClass(Material, [{
		key: "initialize",
		value: function initialize(name) {

			this.name = name;

			this.smooth = true;

			this.specular = {
				force: 1
			};

			return this;
		}
	}, {
		key: "setSpecularForce",
		value: function setSpecularForce(force) {

			this.specular.force = parseFloat(force);

			return this;
		}
	}]);

	return Material;
}();

exports.default = Material;

},{}],5:[function(require,module,exports){
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

			this.defaultMaterial = new _Material2.default("default");

			this.currentMaterial = null;

			this.materials = new Array();

			return this;
		}
	}, {
		key: "addMaterial",
		value: function addMaterial(name) {

			var material = new _Material2.default(name);

			this.currentMaterial = material;

			this.materials.push(material);

			return this;
		}
	}, {
		key: "addSpecularForce",
		value: function addSpecularForce(force) {

			if (this.currentMaterial != null) {

				this.currentMaterial.setSpecularForce(force);
			} else {

				this.defaultMaterial.setSpecularForce(force);
			};

			return this;
		}
	}]);

	return MaterialLibrary;
}();

exports.default = MaterialLibrary;

},{"./Material.js":4}],6:[function(require,module,exports){
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

			this.setName(name);

			this.vertices = new Array();

			this.normals = new Array();

			this.textures = new Array();

			this.faces = new Array();

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
		key: "addVertex",
		value: function addVertex(index) {

			this.vertices.push(index);

			return this;
		}
	}, {
		key: "addNormal",
		value: function addNormal(index) {

			this.normals.push(index);

			return this;
		}
	}, {
		key: "addTexture",
		value: function addTexture(index) {

			this.textures.push(index);

			return this;
		}
	}, {
		key: "addFace",
		value: function addFace(index) {

			this.faces.push(index);

			return this;
		}
	}, {
		key: "setMaterial",
		value: function setMaterial(name) {

			this.material = name;

			return this;
		}
	}]);

	return Model;
}();

exports.default = Model;

},{}],7:[function(require,module,exports){
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

var ModelData = function () {
	function ModelData() {
		_classCallCheck(this, ModelData);

		return this.initialize();
	}

	_createClass(ModelData, [{
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

	return ModelData;
}();

exports.default = ModelData;
;

},{"./Face.js":2,"./Model.js":6,"./Normal.js":8,"./Texture.js":9,"./Vertex.js":10}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ParseImage;
function ParseImage(image, onComplete) {};

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseJSON;
function ParseJSON(json, onComplete) {

	console.log("ParseJSON");
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseMTL;

var _MaterialLibrary = require("../components/MaterialLibrary.js");

var _MaterialLibrary2 = _interopRequireDefault(_MaterialLibrary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ParseMTL(mtl, basePath, onComplete) {

	var materialLibrary = new _MaterialLibrary2.default();

	mtl.split(/\n+/).forEach(function (value, index, array) {

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0].toLowerCase();

		// console.log(info);

		if (type == "newmtl") {

			materialLibrary.addMaterial(info[1]);
		} else if (type == "ns") {

			materialLibrary.addSpecularForce(info[1]);
		};
	});

	onComplete(materialLibrary);
};

},{"../components/MaterialLibrary.js":5}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseOBJ;

var _ParseMTL = require("./ParseMTL.js");

var _ParseMTL2 = _interopRequireDefault(_ParseMTL);

var _ModelData = require("../components/ModelData.js");

var _ModelData2 = _interopRequireDefault(_ModelData);

var _FileLoader = require("../components/FileLoader.js");

var _FileLoader2 = _interopRequireDefault(_FileLoader);

var _MaterialLibrary = require("../components/MaterialLibrary.js");

var _MaterialLibrary2 = _interopRequireDefault(_MaterialLibrary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ParseOBJ(obj, basePath, onComplete) {

	var model = new _ModelData2.default();

	var parseOBJComplete = false;
	var parseMTLComplete = true;

	obj.split(/\n+/).forEach(function (value, index, array) {

		var info = value.split(/\s+/).filter(Boolean);

		var type = info[0];

		if (type == "o") {

			model.addObject(info[1]);
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

},{"../components/FileLoader.js":3,"../components/MaterialLibrary.js":5,"../components/ModelData.js":7,"./ParseMTL.js":13}]},{},[1])(1)
});