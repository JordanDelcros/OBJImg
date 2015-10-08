(function( window, document ){

	var MAX = (255 * 255) + 255;

	var OBJImg = function( path, onLoad ){

		return new OBJImg.fn.init(path, onLoad);

	};

	OBJImg.fn = OBJImg.prototype = {
		constructor: OBJImg,
		init: function( path, onLoad ){

			var image = new Image();

			image.addEventListener("load", function( event ){

				var canvas = document.createElement("canvas");
				var context = canvas.getContext("2d");

				canvas.width = image.naturalWidth;
				canvas.height = image.naturalHeight;

				context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

				this.pixels = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data;

				var pixelIndex = 0;

				var vertices = new Array(this.getPixelValue(pixelIndex++));
				var textures = new Array(this.getPixelValue(pixelIndex++));
				var normals = new Array(this.getPixelValue(pixelIndex++));
				var faces = new Array(this.getPixelValue(pixelIndex++));
				var vertexMultiplicator = this.getPixelValue(pixelIndex++);
				var textureMultiplicator = this.getPixelValue(pixelIndex++);
				var textureOffset = this.getPixelValue(pixelIndex++) / textureMultiplicator;

				var pivot = {
					x: this.getPixelValue(pixelIndex++) / vertexMultiplicator,
					y: this.getPixelValue(pixelIndex++) / vertexMultiplicator,
					z: this.getPixelValue(pixelIndex++) / vertexMultiplicator
				};

				for( var vertex = 0, length = vertices.length; vertex < length; vertex++, pixelIndex += 3 ){

					var x = (this.getPixelValue(pixelIndex) / vertexMultiplicator) - pivot.x;
					var y = (this.getPixelValue(pixelIndex + 1) / vertexMultiplicator) - pivot.y;
					var z = (this.getPixelValue(pixelIndex + 2) / vertexMultiplicator) - pivot.z;

					vertices[vertex] = {
						x: x,
						y: y,
						z: z
					};

				};

				for( var texture = 0, length = textures.length; texture < length; texture++, pixelIndex += 2 ){

					var u = (this.getPixelValue(pixelIndex) / textureMultiplicator) - textureOffset;
					var v = (this.getPixelValue(pixelIndex + 1) / textureMultiplicator) - textureOffset;

					textures[texture] = {
						u: u,
						v: v
					};

				};

				for( var normal = 0, length = normals.length; normal < length; normal++, pixelIndex += 3 ){

					var x = (this.getPixelValue(pixelIndex) / vertexMultiplicator) - 1;
					var y = (this.getPixelValue(pixelIndex + 1) / vertexMultiplicator) - 1;
					var z = (this.getPixelValue(pixelIndex + 2) / vertexMultiplicator) - 1;

					normals[normal] = {
						x: x,
						y: y,
						z: z
					};

				};

				for( var face = 0, length = faces.length; face < length; face++, pixelIndex += 9 ){

					var va = this.getPixelValue(pixelIndex);
					var vb = this.getPixelValue(pixelIndex + 1);
					var vc = this.getPixelValue(pixelIndex + 2);

					var ta = this.getPixelValue(pixelIndex + 3);
					var tb = this.getPixelValue(pixelIndex + 4);
					var tc = this.getPixelValue(pixelIndex + 5);

					var na = this.getPixelValue(pixelIndex + 6);
					var nb = this.getPixelValue(pixelIndex + 7);
					var nc = this.getPixelValue(pixelIndex + 8);

					faces[face] = {
						vertices: {
							a: va,
							b: vb,
							c: vc
						},
						textures: {
							a: ta,
							b: tb,
							c: tc
						},
						normals: {
							a: na,
							b: nb,
							c: nc
						}
					};

				};

				onLoad({
					vertices: vertices,
					textures: textures,
					normals: normals,
					faces: faces
				});

			}.bind(this), false);

			image.src = path;

			return this;

		},
		getPixelColor: function( index ){

			return {
				r: this.pixels[index * 4],
				g: this.pixels[index * 4 + 1],
				b: this.pixels[index * 4 + 2],
				a: this.pixels[index * 4 + 3]
			};

		},
		getPixelValue: function( index ){

			var color = this.getPixelColor(index);

			return color.r * color.g + color.b;

		},
		getColorFromValue: function( value ){

			var g = Math.floor(value / 255);
			var r = (g > 0) ? 255 : 0;
			var b = Math.floor(value - (r * g));
			var a = ((r * g) + b) > 0 ? 1 : 0;

			if( g > 255 ){

				b += Math.abs(255 - g);
				g = 255;

			};

			return {
				r: r,
				g: g,
				b: b,
				a: a
			};

		},
		getValueFromColor: function( r, g, b, a ){

			return r * g + b;

		}
	};

	OBJImg.fn.init.prototype = OBJImg.fn;

	function convertObjToImg( obj ){

		var lines = obj.split(/\n/g);
		var vertices = new Array();
		var textures = new Array();
		var normals = new Array();
		var faces = new Array();

		var bounds = {
			vertex: {
				min: {
					x: Infinity,
					y: Infinity,
					z: Infinity,
					w: Infinity
				},
				max: {
					x: -Infinity,
					y: -Infinity,
					z: -Infinity,
					w: -Infinity
				}
			},
			texture: {
				min: Infinity,
				max: -Infinity
			}
		};

		for( var line = 0, length = lines.length; line < length; line++ ){

			var datas = lines[line].split(/\s+/g);
			var type = datas[0];

			if( type == "v" ){

				var x = parseFloat(datas[1]);
				var y = parseFloat(datas[2]);
				var z = parseFloat(datas[3]);

				if( x < bounds.vertex.min.x ){

					bounds.vertex.min.x = x;

				};

				if( x > bounds.vertex.max.x ){

					bounds.vertex.max.x = x;

				};

				if( y < bounds.vertex.min.y ){

					bounds.vertex.min.y = y;

				};

				if( y > bounds.vertex.max.y ){

					bounds.vertex.max.y = y;

				};

				if( z < bounds.vertex.min.z ){

					bounds.vertex.min.z = z;

				};

				if( z > bounds.vertex.max.z ){

					bounds.vertex.max.z = z;

				};

				vertices.push({
					x: x,
					y: y,
					z: z
				});

			}
			else if( type == "vt" ){

				var u = parseFloat(datas[1]);
				var v = parseFloat(datas[2]);

				var min = Math.min(u, v);
				var max = Math.max(u, v);

				if( min < bounds.texture.min ){

					bounds.texture.min = min;

				};

				if( max > bounds.texture.max ){

					bounds.texture.max = max;

				};

				textures.push({
					u: u,
					v: v
				});

			}
			else if( type == "vn" ){

				normals.push({
					x: parseFloat(datas[1]),
					y: parseFloat(datas[2]),
					z: parseFloat(datas[3])
				});

			}
			else if( type == "f" ){

				var a = datas[1].split(/\//g);
				var b = datas[2].split(/\//g);
				var c = datas[3].split(/\//g);

				var va = parseInt(a[0]) - 1;
				var vb = parseInt(b[0]) - 1;
				var vc = parseInt(c[0]) - 1;

				var ta = parseInt(a[1]) - 1;
				var tb = parseInt(b[1]) - 1;
				var tc = parseInt(c[1]) - 1;

				var na = parseInt(a[2]) - 1;
				var nb = parseInt(b[2]) - 1;
				var nc = parseInt(c[2]) - 1;

				faces.push({
					vertices: {
						a: (!isNaN(va) ? va : null),
						b: (!isNaN(vb) ? vb : null),
						c: (!isNaN(vc) ? vc : null)
					},
					textures: {
						a: (!isNaN(ta) ? ta : null),
						b: (!isNaN(tb) ? tb : null),
						c: (!isNaN(tc) ? tc : null)
					},
					normals: {
						a: (!isNaN(na) ? na : null),
						b: (!isNaN(nb) ? nb : null),
						c: (!isNaN(nc) ? nc : null)
					}
				});

			};

		};

		bounds.vertex.min.w = Math.min(bounds.vertex.min.x, bounds.vertex.min.y, bounds.vertex.min.z);
		bounds.vertex.max.w = Math.max(bounds.vertex.max.x, bounds.vertex.max.y, bounds.vertex.max.z);

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		var pixelIndex = 0;

		var parameters = 9;

		var pixelCount = parameters + (vertices.length * 3) + (textures.length * 2) + (normals.length * 3) + (faces.length * 9);
		var square = Math.ceil(Math.sqrt(pixelCount)); 

		canvas.width = canvas.height = square;

		var vertexColor = OBJImg.fn.getColorFromValue(vertices.length);

		context.fillStyle = "rgba(" + vertexColor.r + ", " + vertexColor.g + ", " + vertexColor.b + ", " + vertexColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var textureColor = OBJImg.fn.getColorFromValue(textures.length);

		context.fillStyle = "rgba(" + textureColor.r + ", " + textureColor.g + ", " + textureColor.b + ", " + textureColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var normalColor = OBJImg.fn.getColorFromValue(normals.length);

		context.fillStyle = "rgba(" + normalColor.r + ", " + normalColor.g + ", " + normalColor.b + ", " + normalColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var faceColor = OBJImg.fn.getColorFromValue(faces.length);

		context.fillStyle = "rgba(" + faceColor.r + ", " + faceColor.g + ", " + faceColor.b + ", " + faceColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var vertexMultiplicatorColor = OBJImg.fn.getColorFromValue(MAX / (bounds.vertex.max.w + Math.abs(bounds.vertex.min.w)));
		var vertexMultiplicator = vertexMultiplicatorColor.r * vertexMultiplicatorColor.g + vertexMultiplicatorColor.b;

		context.fillStyle = "rgba(" + vertexMultiplicatorColor.r + ", " + vertexMultiplicatorColor.g + ", " + vertexMultiplicatorColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var textureMultiplicatorColor = OBJImg.fn.getColorFromValue(MAX / Math.max((bounds.texture.max + Math.abs(bounds.texture.min)), 1));
		var textureMultiplicator = textureMultiplicatorColor.r * textureMultiplicatorColor.g + textureMultiplicatorColor.b;

		context.fillStyle = "rgba(" + textureMultiplicatorColor.r + ", " + textureMultiplicatorColor.g + ", " + textureMultiplicatorColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var offsetTextureColor = OBJImg.fn.getColorFromValue(Math.abs(bounds.texture.min) * textureMultiplicator);

		context.fillStyle = "rgba(" + offsetTextureColor.r + ", " + offsetTextureColor.g + ", " + offsetTextureColor.b + ", " + offsetTextureColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var pivot = {
			x: Math.abs(bounds.vertex.min.x) * vertexMultiplicator,
			y: Math.abs(bounds.vertex.min.y) * vertexMultiplicator,
			z: Math.abs(bounds.vertex.min.z) * vertexMultiplicator
		};

		var pivotXColor = OBJImg.fn.getColorFromValue(pivot.x);

		context.fillStyle = "rgba(" + pivotXColor.r + ", " + pivotXColor.g + ", " + pivotXColor.b + ", " + pivotXColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var pivotYColor = OBJImg.fn.getColorFromValue(pivot.y);

		context.fillStyle = "rgba(" + pivotYColor.r + ", " + pivotYColor.g + ", " + pivotYColor.b + ", " + pivotYColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var pivotZColor = OBJImg.fn.getColorFromValue(pivot.z);

		context.fillStyle = "rgba(" + pivotZColor.r + ", " + pivotZColor.g + ", " + pivotZColor.b + ", " + pivotZColor.a + ")";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		for( var vertex = 0, length = vertices.length; vertex < length; vertex++ ){

			var xColor = OBJImg.fn.getColorFromValue((vertices[vertex].x + Math.abs(bounds.vertex.min.x)) * vertexMultiplicator);

			context.fillStyle = "rgba(" + xColor.r + ", " + xColor.g + ", " + xColor.b + ", " + xColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var yColor = OBJImg.fn.getColorFromValue((vertices[vertex].y + Math.abs(bounds.vertex.min.y)) * vertexMultiplicator);

			context.fillStyle = "rgba(" + yColor.r + ", " + yColor.g + ", " + yColor.b + ", " + yColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var zColor = OBJImg.fn.getColorFromValue((vertices[vertex].z + Math.abs(bounds.vertex.min.z)) * vertexMultiplicator);

			context.fillStyle = "rgba(" + zColor.r + ", " + zColor.g + ", " + zColor.b + ", " + zColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		for( var texture = 0, length = textures.length; texture < length; texture++ ){

			var uColor = OBJImg.fn.getColorFromValue((textures[texture].u + Math.abs(bounds.texture.min)) * textureMultiplicator);

			context.fillStyle = "rgba(" + uColor.r + ", " + uColor.g + ", " + uColor.b + ", " + uColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var vColor = OBJImg.fn.getColorFromValue((textures[texture].v + Math.abs(bounds.texture.min)) * textureMultiplicator);

			context.fillStyle = "rgba(" + vColor.r + ", " + vColor.g + ", " + vColor.b + ", " + vColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		for( var normal = 0, length = normals.length; normal < length; normal++ ){

			var xColor = OBJImg.fn.getColorFromValue((normals[normal].x + 1) * vertexMultiplicator);

			context.fillStyle = "rgba(" + xColor.r + ", " + xColor.g + ", " + xColor.b + ", " + xColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var yColor = OBJImg.fn.getColorFromValue((normals[normal].y + 1) * vertexMultiplicator);

			context.fillStyle = "rgba(" + yColor.r + ", " + yColor.g + ", " + yColor.b + ", " + yColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var zColor = OBJImg.fn.getColorFromValue((normals[normal].z + 1) * vertexMultiplicator);

			context.fillStyle = "rgba(" + zColor.r + ", " + zColor.g + ", " + zColor.b + ", " + zColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		for( var face = 0, length = faces.length; face < length; face++ ){

			var aColor = OBJImg.fn.getColorFromValue(faces[face].vertices.a);

			context.fillStyle = "rgba(" + aColor.r + ", " + aColor.g + ", " + aColor.b + ", " + aColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var bColor = OBJImg.fn.getColorFromValue(faces[face].vertices.b);

			context.fillStyle = "rgba(" + bColor.r + ", " + bColor.g + ", " + bColor.b + ", " + bColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var cColor = OBJImg.fn.getColorFromValue(faces[face].vertices.c);

			context.fillStyle = "rgba(" + cColor.r + ", " + cColor.g + ", " + cColor.b + ", " + cColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var taColor = OBJImg.fn.getColorFromValue(faces[face].textures.a);

			context.fillStyle = "rgba(" + taColor.r + ", " + taColor.g + ", " + taColor.b + ", " + taColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var tbColor = OBJImg.fn.getColorFromValue(faces[face].textures.b);

			context.fillStyle = "rgba(" + tbColor.r + ", " + tbColor.g + ", " + tbColor.b + ", " + tbColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var tcColor = OBJImg.fn.getColorFromValue(faces[face].textures.c);

			context.fillStyle = "rgba(" + tcColor.r + ", " + tcColor.g + ", " + tcColor.b + ", " + tcColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var naColor = OBJImg.fn.getColorFromValue(faces[face].normals.a);

			context.fillStyle = "rgba(" + naColor.r + ", " + naColor.g + ", " + naColor.b + ", " + naColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var nbColor = OBJImg.fn.getColorFromValue(faces[face].normals.b);

			context.fillStyle = "rgba(" + nbColor.r + ", " + nbColor.g + ", " + nbColor.b + ", " + nbColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var ncColor = OBJImg.fn.getColorFromValue(faces[face].normals.c);

			context.fillStyle = "rgba(" + ncColor.r + ", " + ncColor.g + ", " + ncColor.b + ", " + ncColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		return canvas.toDataURL("image/png", 1.0);

	};

	OBJImg.generateImg = function( path, onLoad ){

		var isURL = !path.match(/[\n\s]/);

		var fileInfo = path.split(/\//g);
		var fileName = fileInfo[fileInfo.length - 1].split(/\./)[0];

		if( isURL ){

			var xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function( event ){

				if( xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400 ){

					obj = xhr.responseText;

					onLoad(convertObjToImg(obj));

				}
				else if( xhr.readyState == 4 ){

					console.error("Cant load obj");

				};

			}, false);

			xhr.open("GET", path, true);
			xhr.send(null);

		}
		else {

			onLoad(convertObjToImg(path));

		};

		return this;

	};

	window.OBJImg = OBJImg;

})(window, document);