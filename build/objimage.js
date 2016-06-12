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

			this.file = new _FileLoader2.default(path, function (fileData, type) {

				if (type == _FileLoader.FileType.IMAGE) {

					(0, _ParseImage2.default)(fileData, function () {});
				} else if (type == _FileLoader.FileType.OBJ) {

					(0, _ParseOBJ2.default)(fileData, function () {});
				} else if (type == _FileLoader.FileType.MTL) {} else if (type == _FileLoader.FileType.JSON) {

					(0, _ParseJSON2.default)(fileData, function () {});
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

},{"./components/FileLoader.js":2,"./methods/ParseImage.js":6,"./methods/ParseJSON.js":7,"./methods/ParseOBJ.js":8}],2:[function(require,module,exports){
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

					onComplete(JSON.parse(data), type);
				}, onFail);
			};

			return this;
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

		onComplete(image, _this.type || FileType.IMAGE);
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

				onComplete(event.target.responseText, _this2.type || FileType.TEXT);
			} else if (event.target.status >= 400) {

				onFail();
			};
		}
	}, false);

	request.open("GET", path, true);

	request.send(null);

	return null;
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ModelObject = require("./ModelObject.js");

var _ModelObject2 = _interopRequireDefault(_ModelObject);

var _Vertex = require("./Vertex.js");

var _Vertex2 = _interopRequireDefault(_Vertex);

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

			this.defaultObject = new _ModelObject2.default("default");

			this.currentObject = null;

			this.objects = new Array();

			this.vertices = new Array();

			return this;
		}
	}, {
		key: "addObject",
		value: function addObject(name) {

			var object = new _ModelObject2.default(name);

			this.currentObject = object;

			this.objects.push(object);

			return this;
		}
	}, {
		key: "addVertex",
		value: function addVertex(x, y, z) {

			var index = this.vertices.push(new _Vertex2.default(x, y, z));

			if (this.currentObject != null) {

				this.currentObject.addVertex(index);
			} else {

				this.defaultObject.addVertex(index);
			};

			return this;
		}
	}]);

	return ModelData;
}();

exports.default = ModelData;
;

},{"./ModelObject.js":4,"./Vertex.js":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelObject = function () {
	function ModelObject(name) {
		_classCallCheck(this, ModelObject);

		return this.initialize(name);
	}

	_createClass(ModelObject, [{
		key: "initialize",
		value: function initialize(name) {

			this.setName(name);

			this.vertices = new Array();

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
	}]);

	return ModelObject;
}();

exports.default = ModelObject;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ParseImage;
function ParseImage(image, onComplete) {};

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseJSON;
function ParseJSON(json, onComplete) {

	console.log("ParseJSON");
};

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ParseOBJ;

var _ModelData = require("../components/ModelData.js");

var _ModelData2 = _interopRequireDefault(_ModelData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ParseOBJ(obj, onComplete) {

	var model = new _ModelData2.default();

	obj.split(/\n/).forEach(function (value, index, array) {

		var info = value.split(/\s+/);

		var type = info[0];

		if (type == "o") {

			model.addObject(info[1]);
		} else if (type == "v") {

			var x = info[1];
			var y = info[2];
			var z = info[3];

			model.addVertex(x, y, z);
		};
	});

	console.log(model);
};

},{"../components/ModelData.js":3}]},{},[1])(1)
});