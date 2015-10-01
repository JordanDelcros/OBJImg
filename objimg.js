(function( window, document ){

	var OBJImg = function( image ){

		return new OBJImg.fn.init(image);

	};

	OBJImg.fn = OBJImg.prototype = {
		constructor: OBJImg,
		init: function( image ){

			console.info("IMPORT");

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
			var multiplicator = this.getPixelValue(pixelIndex++);
			var pivot = {
				x: this.getPixelValue(pixelIndex++) / multiplicator,
				y: this.getPixelValue(pixelIndex++) / multiplicator,
				z: this.getPixelValue(pixelIndex++) / multiplicator
			};

			console.log("vertices:", vertices.length, "textures:", textures.length, "normals:", normals.length, "faces:", faces.length, "multi:", multiplicator, "pivot", pivot);

			var bounds = {
				min: {
					x: Infinity,
					y: Infinity,
					z: Infinity
				},
				max: {
					x: -Infinity,
					y: -Infinity,
					z: -Infinity
				}
			};

			for( var vertex = 0, length = vertices.length; vertex < length; vertex++, pixelIndex+= 3 ){

				var x = this.getPixelValue(pixelIndex) / multiplicator;
				var y = this.getPixelValue(pixelIndex + 1) / multiplicator;
				var z = this.getPixelValue(pixelIndex + 2) / multiplicator;

				if( x < bounds.min.x ){

					bounds.min.x = x;

				};

				if( x > bounds.max.x ){

					bounds.max.x = x;

				};

				if( y < bounds.min.y ){

					bounds.min.y = y;

				};

				if( y > bounds.max.y ){

					bounds.max.y = y;

				};

				if( z < bounds.min.z ){

					bounds.min.z = z;

				};

				if( z > bounds.max.z ){

					bounds.max.z = z;

				};

				vertices[vertex] = {
					x: x,
					y: y,
					z: z
				};

			};

			// var center = {
			// 	x: bounds.min.x + ((bounds.max.x - bounds.min.x) / 2),
			// 	y: bounds.min.y + ((bounds.max.y - bounds.min.y) / 2),
			// 	z: bounds.min.z + ((bounds.max.z - bounds.min.z) / 2)
			// };

			for( var vertex = 0, length = vertices.length; vertex < length; vertex++ ){

				vertices[vertex].x -= pivot.x;
				vertices[vertex].y -= pivot.y;
				vertices[vertex].z -= pivot.z;

			};

			for( var texture = 0, length = textures.length; texture < length; texture++, pixelIndex++ ){

			};

			for( var normal = 0, length = normals.length; normal < length; normal++, pixelIndex++ ){

			};

			for( var face = 0, length = faces.length; face < length; face++, pixelIndex++ ){

			};

			return {
				vertices: vertices
			};

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

			var r = 255;
			var g = Math.floor(value / 255);
			var b = Math.floor(value - (r * g));
			var a = 1;

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

	OBJImg.format = {
		uncompressed: 0,
		compressed: 1
	};

	OBJImg.generateImg = function( obj, format ){

		console.info("GENERATE");

		var lines = obj.split(/\n/g);

		var vertices = new Array();
		var textures = new Array();
		var normals = new Array();
		var faces = new Array();

		var bounds = {
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
		};

		for( var line = 0, length = lines.length; line < length; line++ ){

			var datas = lines[line].split(/\s+/g);
			var type = datas[0];

			if( type == "v" ){

				var x = parseFloat(datas[1]);
				var y = parseFloat(datas[2]);
				var z = parseFloat(datas[3]);

				if( x < bounds.min.x ){

					bounds.min.x = x;

				};

				if( x > bounds.max.x ){

					bounds.max.x = x;

				};

				if( y < bounds.min.y ){

					bounds.min.y = y;

				};

				if( y > bounds.max.y ){

					bounds.max.y = y;

				};

				if( z < bounds.min.z ){

					bounds.min.z = z;

				};

				if( z > bounds.max.z ){

					bounds.max.z = z;

				};

				vertices.push({
					x: x,
					y: y,
					z: z
				});

			}
			else if( type == "vt" ){

				textures.push({
					u: parseFloat(datas[1]),
					v: parseFloat(datas[2])
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

				faces.push({
					vertices: {
						a: parseInt(a[0]),
						b: parseInt(b[0]),
						c: parseInt(c[0])
					},
					textures: {
						a: parseInt(a[1]),
						b: parseInt(b[1]),
						c: parseInt(c[1])
					},
					normals: {
						a: parseInt(a[2]),
						b: parseInt(b[2]),
						c: parseInt(c[2])
					}
				});

			};

		};

		bounds.min.w = Math.min(bounds.min.x, bounds.min.y, bounds.min.z);
		bounds.max.w = Math.max(bounds.max.x, bounds.max.y, bounds.max.z);

		// console.log(bounds);

		// var center = {
		// 	x: bounds.min.x + ((bounds.max.x - bounds.min.x) / 2),
		// 	y: bounds.min.y + ((bounds.max.y - bounds.min.y) / 2),
		// 	z: bounds.min.z + ((bounds.max.z - bounds.min.z) / 2)
		// };

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		//
		document.body.appendChild(canvas);
		//

		var pixelIndex = 0;

		var pixelCount = 8 + (vertices.length * 3) + (textures.length * 2) + (normals.length * 3) + (faces.length * 9);
		var square = Math.ceil(Math.sqrt(pixelCount)); 

		canvas.width = canvas.height = square;

		var vertexColor = OBJImg.fn.getColorFromValue(vertices.length);

		context.fillStyle = "rgba(" + vertexColor.r + ", " + vertexColor.g + ", " + vertexColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var textureColor = OBJImg.fn.getColorFromValue(textures.length);

		context.fillStyle = "rgba(" + textureColor.r + ", " + textureColor.g + ", " + textureColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var normalColor = OBJImg.fn.getColorFromValue(normals.length);

		context.fillStyle = "rgba(" + normalColor.r + ", " + normalColor.g + ", " + normalColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var faceColor = OBJImg.fn.getColorFromValue(faces.length);

		context.fillStyle = "rgba(" + faceColor.r + ", " + faceColor.g + ", " + faceColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var multiplicatorColor = OBJImg.fn.getColorFromValue((255 * 255 + 255) / (bounds.max.w + Math.abs(bounds.min.w)));
		var multiplicator = multiplicatorColor.r * multiplicatorColor.g + multiplicatorColor.b;

		context.fillStyle = "rgba(" + multiplicatorColor.r + ", " + multiplicatorColor.g + ", " + multiplicatorColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var pivot = {
			x: Math.abs(bounds.min.x) * multiplicator,
			y: Math.abs(bounds.min.y) * multiplicator,
			z: Math.abs(bounds.min.z) * multiplicator
		};

		var pivotXColor = OBJImg.fn.getColorFromValue(pivot.x);

		context.fillStyle = "rgba(" + pivotXColor.r + ", " + pivotXColor.g + ", " + pivotXColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var pivotYColor = OBJImg.fn.getColorFromValue(pivot.y);

		context.fillStyle = "rgba(" + pivotYColor.r + ", " + pivotYColor.g + ", " + pivotYColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		var pivotZColor = OBJImg.fn.getColorFromValue(pivot.z);

		console.log("find", pivotYColor)

		context.fillStyle = "rgba(" + pivotZColor.r + ", " + pivotZColor.g + ", " + pivotZColor.b + ", 1)";
		context.fillRect(pixelIndex, 0, 1, 1);
		pixelIndex++;

		for( var vertex = 0, length = vertices.length; vertex < length; vertex++ ){

			var xColor = OBJImg.fn.getColorFromValue((vertices[vertex].x + Math.abs(bounds.min.x)) * multiplicator);

			context.fillStyle = "rgba(" + xColor.r + ", " + xColor.g + ", " + xColor.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var yColor = OBJImg.fn.getColorFromValue((vertices[vertex].y + Math.abs(bounds.min.y)) * multiplicator);

			context.fillStyle = "rgba(" + yColor.r + ", " + yColor.g + ", " + yColor.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var zColor = OBJImg.fn.getColorFromValue((vertices[vertex].z + Math.abs(bounds.min.z)) * multiplicator);

			context.fillStyle = "rgba(" + zColor.r + ", " + zColor.g + ", " + zColor.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		for( var texture = 0, length = textures.length; texture < length; texture++ ){

			context.fillStyle = "rgba(255, " + ((textures[texture].u - (textures[texture].u % 255)) / 255) + ", " + (textures[texture].u % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((textures[texture].v - (textures[texture].v % 255)) / 255) + ", " + (textures[texture].v % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		for( var normal = 0, length = normals.length; normal < length; normal++ ){

			context.fillStyle = "rgba(255, " + ((normals[normal].x - (normals[normal].x % 255)) / 255) + ", " + (normals[normal].x % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((normals[normal].y - (normals[normal].y % 255)) / 255) + ", " + (normals[normal].y % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((normals[normal].z - (normals[normal].z % 255)) / 255) + ", " + (normals[normal].z % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		for( var face = 0, length = faces.length; face < length; face++ ){

			context.fillStyle = "rgba(255, " + ((faces[face].vertices.x - (faces[face].vertices.x % 255)) / 255) + ", " + (faces[face].vertices.x % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((faces[face].vertices.y - (faces[face].vertices.y % 255)) / 255) + ", " + (faces[face].vertices.y % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((faces[face].vertices.z - (faces[face].vertices.z % 255)) / 255) + ", " + (faces[face].vertices.z % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;


			context.fillStyle = "rgba(255, " + ((faces[face].textures.x - (faces[face].textures.x % 255)) / 255) + ", " + (faces[face].textures.x % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((faces[face].textures.y - (faces[face].textures.y % 255)) / 255) + ", " + (faces[face].textures.y % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((faces[face].textures.z - (faces[face].textures.z % 255)) / 255) + ", " + (faces[face].textures.z % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;


			context.fillStyle = "rgba(255, " + ((faces[face].normals.x - (faces[face].normals.x % 255)) / 255) + ", " + (faces[face].normals.x % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((faces[face].normals.y - (faces[face].normals.y % 255)) / 255) + ", " + (faces[face].normals.y % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((faces[face].normals.z - (faces[face].normals.z % 255)) / 255) + ", " + (faces[face].normals.z % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		var datas = context.getImageData(0, 1, square, square);
		// var datas = canvas.toDataURL("image/png");

	};

	window.OBJImg = OBJImg;

})(window, document);