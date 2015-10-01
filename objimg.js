(function( window, document ){

	var OBJImg = function( image ){

		return new OBJImg.fn.init(image);

	};

	OBJImg.fn = OBJImg.prototype = {
		constructor: OBJImg,
		init: function( image ){

			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");

			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

			context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

			this.pixels = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data;

			var vertices = new Array(this.getPixelValue(0));
			var textures = new Array(this.getPixelValue(1));
			var normals = new Array(this.getPixelValue(2));
			var faces = new Array(this.getPixelValue(3));

			console.log("vertices:", vertices.length, "textures:", textures.length, "normals:", normals.length, "faces:", faces.length);

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

			pixelIndex = 4;

			for( var vertex = 0, length = vertices.length; vertex < length; vertex++, pixelIndex+= 3 ){

				var x = this.getPixelValue(pixelIndex) ;
				var y = this.getPixelValue(pixelIndex + 1) ;
				var z = this.getPixelValue(pixelIndex + 2) ;

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

			var center = {
				x: bounds.min.x + ((bounds.max.x - bounds.min.x) / 2),
				y: bounds.min.y + ((bounds.max.y - bounds.min.y) / 2),
				z: bounds.min.z + ((bounds.max.z - bounds.min.z) / 2)
			};

			for( var vertex = 0, length = vertices.length; vertex < length; vertex++ ){

				vertices[vertex].x -=  center.x;
				vertices[vertex].y -=  center.y;
				vertices[vertex].z -=  center.z;

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

		}
	};

	OBJImg.fn.init.prototype = OBJImg.fn;

	OBJImg.format = {
		uncompressed: 0,
		compressed: 1
	};

	OBJImg.generateImg = function( obj, format ){

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

				var x = parseFloat(datas[1] );
				var y = parseFloat(datas[2] );
				var z = parseFloat(datas[3] );

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

		var center = {
			x: bounds.min.x + ((bounds.max.x - bounds.min.x) / 2),
			y: bounds.min.y + ((bounds.max.y - bounds.min.y) / 2),
			z: bounds.min.z + ((bounds.max.z - bounds.min.z) / 2)
		};

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		//
		document.body.appendChild(canvas);
		//

		var pixelIndex = 0;
		var pixelCount = 5 + (vertices.length * 3) + (textures.length * 2) + (normals.length * 3) + (faces.length * 9);
		
		var square = Math.ceil(Math.sqrt(pixelCount)); 

		canvas.width = canvas.height = square;

		context.fillStyle = "rgba(255, " + ((vertices.length - (vertices.length % 255)) / 255) + ", " + (vertices.length % 255) + ", 1)";
		context.fillRect(0, 0, 1, 1);
		pixelIndex++;

		context.fillStyle = "rgba(255, " + ((textures.length - (textures.length % 255)) / 255) + ", " + (textures.length % 255) + ", 1)";
		context.fillRect(1, 0, 1, 1);
		pixelIndex++;

		context.fillStyle = "rgba(255, " + ((normals.length - (normals.length % 255)) / 255) + ", " + (normals.length % 255) + ", 1)";
		context.fillRect(2, 0, 1, 1);
		pixelIndex++;

		context.fillStyle = "rgba(255, " + ((faces.length - (faces.length % 255)) / 255) + ", " + (faces.length % 255) + ", 1)";
		context.fillRect(3, 0, 1, 1);
		pixelIndex++;

		for( var vertex = 0, length = vertices.length; vertex < length; vertex++ ){

			var x = Math.round(vertices[vertex].x + Math.abs(bounds.min.x));
			var y = Math.round(vertices[vertex].y + Math.abs(bounds.min.y));
			var z = Math.round(vertices[vertex].z + Math.abs(bounds.min.z));

			context.fillStyle = "rgba(255, " + ((x - (x % 255)) / 255) + ", " + (x % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((y - (y % 255)) / 255) + ", " + (y % 255) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(255, " + ((z - (z % 255)) / 255) + ", " + (z % 255) + ", 1)";
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