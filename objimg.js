(function( window, document ){

	var basePath = ( document ? Array.prototype.slice.call(document.querySelectorAll("script")).pop().getAttribute("src").split("/").slice(0, -1).join("/") + "/" : "");

	var MAX = (255 * 255) + 255;

	var OBJImg = function( path, useWorker, onLoad ){

		return new OBJImg.fn.init(path, useWorker, onLoad);

	};

	OBJImg.fn = OBJImg.prototype = {
		constructor: OBJImg,
		init: function( path, useWorker, onLoad ){

			this.datas = null;

			this.canvas = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");

			this.object3D = window.THREE ? new window.THREE.Object3D() : null;
			this.simpleObject3D = window.THREE ? new window.THREE.Object3D() : null;
			this.updateObject3D = false;
			this.updateSimpleObject3D = false;
			this.onComplete = null;

			if( useWorker == true ){

				var worker = new Worker(basePath + "objimg-worker.js");

				worker.addEventListener("message", function( event ){

					this.datas = event.data;

					if( this.updateObject3D == true ){

						this.setObject3D();

					};

					if( this.updateSimpleObject3D == true ){

						this.setSimpleObject3D();

					};

					if( onLoad instanceof Function ){

						onLoad(this.datas);

					};

				}.bind(this), false);

				worker.addEventListener("error", function( event ){

					console.log("worker error");

				}.bind(this), false);

			};

			if( path instanceof Image ){

				if( path.complete == true ){

					if( useWorker == true ){

						worker.postMessage(["convertImgToObj", this.getPixels(path)]);

					}
					else {

						this.datas = OBJImg.convertImgToObj(this.getPixels(path));

						if( this.updateObject3D == true ){

							this.setObject3D();

						};

						if( this.updateSimpleObject3D == true ){

							this.setSimpleObject3D();

						};

						if( onLoad instanceof Function ){

							onLoad(this.datas);

						};

					};

				}
				else {

					path.addEventListener("load", function( event ){

						if( useWorker == true ){

							worker.postMessage(["convertImgToObj", this.getPixels(path)]);

						}
						else {

							this.datas = OBJImg.convertImgToObj(this.getPixels(path));

							if( this.updateObject3D == true ){

								this.setObject3D();

							};

							if( this.updateSimpleObject3D == true ){

								this.setSimpleObject3D();

							};

							if( onLoad instanceof Function ){

								onLoad(this.datas);

							};

						};

					}.bind(this), false);

				};

			}
			else {

				var image = new Image();

				image.addEventListener("load", function( event ){

					if( useWorker == true ){

						worker.postMessage(["convertImgToObj", this.getPixels(image)]);

					}
					else {

						this.datas = OBJImg.convertImgToObj(this.getPixels(image));

						if( this.updateObject3D == true ){

							this.setObject3D();

						};

						if( this.updateSimpleObject3D == true ){

							this.setSimpleObject3D();

						};

						if( onLoad instanceof Function ){

							onLoad(this.datas);

						};

					};

				}.bind(this), false);

				image.src = path;

			};

			return this;

		},
		getPixels: function( image ){

			this.canvas.width = image.naturalWidth;
			this.canvas.height = image.naturalHeight;

			this.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

			return this.context.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data;

		},
		setObject3D: function(){

			if( this.datas != null ){

				window.datas = this.datas;

				for( var object = 0, length = this.datas.objects.length; object < length; object++ ){

					var geometry = new THREE.Geometry();

					var sharedVertices = new Array();

					for( var face = 0, faceLength = this.datas.objects[object].faces.length; face < faceLength; face++ ){

						var faceID = this.datas.objects[object].faces[face];
						var verticesID = faceID.vertices;
						var normalsID = faceID.normals;

						var vertexAID = sharedVertices.indexOf(verticesID.a);

						if( vertexAID == -1 ){

							vertexAID = sharedVertices.push(verticesID.a) - 1;

							var vertexA = this.datas.vertices[verticesID.a];

							geometry.vertices.push(new THREE.Vector3(vertexA.x, vertexA.y, vertexA.z));

						};

						var vertexBID = sharedVertices.indexOf(verticesID.b);

						if( vertexBID == -1 ){

							vertexBID = sharedVertices.push(verticesID.b) - 1;

							var vertexB = this.datas.vertices[verticesID.b];

							geometry.vertices.push(new THREE.Vector3(vertexB.x, vertexB.y, vertexB.z));

						};

						var vertexCID = sharedVertices.indexOf(verticesID.c);

						if( vertexCID == -1 ){

							vertexCID = sharedVertices.push(verticesID.c) - 1;

							var vertexC = this.datas.vertices[verticesID.c];

							geometry.vertices.push(new THREE.Vector3(vertexC.x, vertexC.y, vertexC.z));

						};

						var normals = null;

						if( this.datas.normals.length > 0 ){

							normals = [
								this.datas.normals[normalsID.a],
								this.datas.normals[normalsID.b],
								this.datas.normals[normalsID.c]
							];

						};

						geometry.faces.push(new THREE.Face3(vertexAID, vertexBID, vertexCID, normals));

					};

					var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
						color: Math.random() * 0xFFFFFF,
						side: THREE.DoubleSide
					}));

					this.object3D.add(mesh);

				};

				if( this.onComplete instanceof Function ){

					this.onComplete(this.object3D);

				};

			};

			return this;

		},
		getObject3D: function( onComplete ){

			this.updateObject3D = true;

			this.onComplete = onComplete;

			return this.object3D;

		},
		setSimpleObject3D: function(){

			if( this.datas != null ){

				var geometry = new THREE.Geometry();

				for( var vertex = 0, length = this.datas.vertices.length; vertex < length; vertex++ ){

					geometry.vertices.push(new THREE.Vector3(this.datas.vertices[vertex].x, this.datas.vertices[vertex].y, this.datas.vertices[vertex].z));

				};

				for( var face = 0, length = this.datas.faces.length; face < length; face++ ){

					var vertexA = this.datas.faces[face].vertices.a;
					var vertexB = this.datas.faces[face].vertices.b;
					var vertexC = this.datas.faces[face].vertices.c;

					var normals = null;

					if( this.datas.normals.length > 0 ){

						normals = [
							this.datas.normals[this.datas.faces[face].normals.a],
							this.datas.normals[this.datas.faces[face].normals.b],
							this.datas.normals[this.datas.faces[face].normals.c],
						];

					};

					geometry.faces.push(new THREE.Face3(vertexA, vertexB, vertexC, normals));

					if( this.datas.textures.length > 0 ){

						var uvA = this.datas.textures[this.datas.faces[face].textures.a];
						var uvB = this.datas.textures[this.datas.faces[face].textures.b];
						var uvC = this.datas.textures[this.datas.faces[face].textures.c];

						if( uvA && uvB && uvC ){

							geometry.faceVertexUvs[0].push([
								new THREE.Vector2(uvA.u, uvA.v),
								new THREE.Vector2(uvB.u, uvB.v),
								new THREE.Vector2(uvC.u, uvC.v)
							]);

						};

					};

				};

				geometry.computeBoundingBox();

				var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());

				this.object3D.add(mesh);

				if( this.onComplete instanceof Function ){

					this.onComplete(this.object3D);

				};

			};

			return this;

		},
		getSimpleObject3D: function( onComplete ){

			this.updateSimpleObject3D = true;

			this.onComplete = onComplete;

			return this.object3D;

		},
		getPixelColor: function( index, pixels ){

			pixels = (pixels || this.pixels);

			return {
				r: pixels[index * 4],
				g: pixels[index * 4 + 1],
				b: pixels[index * 4 + 2],
				a: pixels[index * 4 + 3]
			};

		},
		getPixelValue: function( index, pixels ){

			pixels = (pixels || this.pixels);

			var color = this.getPixelColor(index, pixels);

			return color.r * color.g + color.b;

		},
		getColorFromValue: function( value ){

			var g = Math.min(Math.floor(value / 255), 255);
			var r = (g > 0) ? 255 : 0;
			var b = Math.floor(value - (r * g));
			var a = ((r * g) + b) > 0 ? 1 : 0;

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

	OBJImg.generateImg = function( path, onLoad ){

		var isURL = !path.match(/[\n\s]/);

		var fileInfo = path.split(/\//g);
		var fileName = fileInfo[fileInfo.length - 1].split(/\./)[0];

		if( isURL ){

			var xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function( event ){

				if( xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400 ){

					obj = xhr.responseText;

					onLoad(OBJImg.convertObjToImg(obj));


				}
				else if( xhr.readyState == 4 ){

					console.error("Cant load obj");

				};

			}, false);

			xhr.open("GET", path, true);
			xhr.send(null);

		}
		else {

			onLoad(OBJImg.convertObjToImg(path));

		};

		return this;

	};

	OBJImg.convertImgToObj = function( pixels ){

		var pixelIndex = 0;

		var vertexSplitting = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
		var textureSplitting = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
		var normalSplitting = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
		var faceSplitting = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

		var vertexCount = 0;

		for( var pass = 0; pass < vertexSplitting; pass++ ){

			vertexCount += OBJImg.fn.getPixelValue(pixelIndex++, pixels);

		};

		var vertices = new Array(vertexCount)

		var textureCount = 0;

		for( var pass = 0; pass < textureSplitting; pass++ ){

			textureCount += OBJImg.fn.getPixelValue(pixelIndex++, pixels);

		};

		var textures = new Array(textureCount)

		var normalCount = 0;

		for( var pass = 0; pass < normalSplitting; pass++ ){

			normalCount += OBJImg.fn.getPixelValue(pixelIndex++, pixels);

		};

		var normals = new Array(normalCount)

		var faceCount = 0;

		for( var pass = 0; pass < faceSplitting; pass++ ){

			faceCount += OBJImg.fn.getPixelValue(pixelIndex++, pixels);

		};

		var faces = new Array(faceCount)

		var vertexMultiplicator = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

		if( textures.length > 0 ){

			var textureMultiplicator = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

			var textureOffset = OBJImg.fn.getPixelValue(pixelIndex++, pixels) / textureMultiplicator;

		};

		var objects = new Array(OBJImg.fn.getPixelValue(pixelIndex++, pixels));

		for( var object = 0, length = objects.length; object < length; object++ ){

			var objectIndex = 0;

			for( var pass = 0; pass < faceSplitting; pass++ ){

				objectIndex += OBJImg.fn.getPixelValue(pixelIndex++, pixels);

			};

			objects[object] = {
				index: objectIndex,
				faces: new Array()
			};

		};

		var groups = new Array(OBJImg.fn.getPixelValue(pixelIndex++, pixels));

		for( var group = 0, length = groups.length; group < length; group++ ){

			var groupIndex = 0;

			for( var pass = 0; pass < faceSplitting; pass++ ){

				groupIndex += OBJImg.fn.getPixelValue(pixelIndex++, pixels);

			};

			groups[group] = groupIndex

		};

		var pivot = {
			x: OBJImg.fn.getPixelValue(pixelIndex++, pixels) / vertexMultiplicator,
			y: OBJImg.fn.getPixelValue(pixelIndex++, pixels) / vertexMultiplicator,
			z: OBJImg.fn.getPixelValue(pixelIndex++, pixels) / vertexMultiplicator
		};

		for( var vertex = 0, length = vertices.length; vertex < length; vertex++, pixelIndex += 3 ){

			var x = (OBJImg.fn.getPixelValue(pixelIndex, pixels) / vertexMultiplicator) - pivot.x;
			var y = (OBJImg.fn.getPixelValue(pixelIndex + 1, pixels) / vertexMultiplicator) - pivot.y;
			var z = (OBJImg.fn.getPixelValue(pixelIndex + 2, pixels) / vertexMultiplicator) - pivot.z;

			vertices[vertex] = {
				x: x,
				y: y,
				z: z
			};

		};

		for( var texture = 0, length = textures.length; texture < length; texture++, pixelIndex += 2 ){

			var u = (OBJImg.fn.getPixelValue(pixelIndex, pixels) / textureMultiplicator) - textureOffset;
			var v = (OBJImg.fn.getPixelValue(pixelIndex + 1, pixels) / textureMultiplicator) - textureOffset;

			textures[texture] = {
				u: u,
				v: v
			};

		};

		for( var normal = 0, length = normals.length; normal < length; normal++, pixelIndex += 3 ){

			var x = (OBJImg.fn.getPixelValue(pixelIndex, pixels) / vertexMultiplicator) - 1;
			var y = (OBJImg.fn.getPixelValue(pixelIndex + 1, pixels) / vertexMultiplicator) - 1;
			var z = (OBJImg.fn.getPixelValue(pixelIndex + 2, pixels) / vertexMultiplicator) - 1;

			normals[normal] = {
				x: x,
				y: y,
				z: z
			};

		};

		for( var face = 0, length = faces.length; face < length; face++, pixelIndex += ((3 * vertexSplitting) + (3 * textureSplitting) + (3 * normalSplitting)) ){

			var va = 0;
			var vb = 0;
			var vc = 0;

			for( var pass = 0; pass < vertexSplitting; pass++ ){

				va += OBJImg.fn.getPixelValue(pixelIndex + pass, pixels);
				vb += OBJImg.fn.getPixelValue(pixelIndex + vertexSplitting + pass, pixels);
				vc += OBJImg.fn.getPixelValue(pixelIndex + (2 * vertexSplitting) + pass, pixels);

			};

			var ta = 0;
			var tb = 0;
			var tc = 0;

			for( var pass = 0; pass < textureSplitting; pass++ ){

				ta += OBJImg.fn.getPixelValue(pixelIndex + (3 * vertexSplitting) + pass, pixels);
				tb += OBJImg.fn.getPixelValue(pixelIndex + (3 * vertexSplitting) + textureSplitting + pass, pixels);
				tc += OBJImg.fn.getPixelValue(pixelIndex + (3 * vertexSplitting) + (2 * textureSplitting) + pass, pixels);

			};

			var na = 0;
			var nb = 0;
			var nc = 0;

			for( var pass = 0; pass < normalSplitting; pass++ ){

				na += OBJImg.fn.getPixelValue(pixelIndex + (3 * vertexSplitting) + (3 * textureSplitting) + pass, pixels);
				nb += OBJImg.fn.getPixelValue(pixelIndex + (3 * vertexSplitting) + (3 * textureSplitting) + normalSplitting + pass, pixels);
				nc += OBJImg.fn.getPixelValue(pixelIndex + (3 * vertexSplitting) + (3 * textureSplitting) + (2 * normalSplitting) + pass, pixels);

			};

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

			for( var object = (objects.length - 1); object >= 0; object-- ){

				if( face >= objects[object].index ){

					objects[object].faces.push(faces[face]);

					break;

				};

			};

		};

		return {
			vertices: vertices,
			textures: textures,
			normals: normals,
			faces: faces,
			objects: objects
		};

	};

	OBJImg.convertObjToImg = function( obj ){

		var lines = obj.split(/\n/g);
		var objects = new Array();
		var groups = new Array();
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

			}
			else if( type == "o" ){

				objects.push({
					name: datas[1],
					index: faces.length
				});

			}
			else if( type == "g" ){

			};

		};

		bounds.vertex.min.w = Math.min(bounds.vertex.min.x, bounds.vertex.min.y, bounds.vertex.min.z);
		bounds.vertex.max.w = Math.max(bounds.vertex.max.x, bounds.vertex.max.y, bounds.vertex.max.z);

		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		var pixelIndex = 0;

		var vertexSplitting = Math.ceil(vertices.length / MAX);
		var textureSplitting = Math.ceil(textures.length / MAX);
		var normalSplitting = Math.ceil(normals.length / MAX);
		var faceSplitting = Math.ceil(faces.length / MAX);

		var parameters = (function( entries ){

			var count = 0;

			for( var entry in entries ){

				count += entries[entry];

			};

			return count;

		})({
			vertexSplitting: 1,
			textureSplitting: 1,
			normalSplitting: 1,
			faceSplitting: 1,
			vertices: vertexSplitting,
			textures: textureSplitting,
			normals: normalSplitting,
			faces: faceSplitting,
			vertexMultiplicator: 1,
			textureMultiplicator: (textureSplitting > 0 ? 1 : 0),
			textureOffset: (textureSplitting > 0 ? 1 : 0),
			objects: 1 + (objects.length * faceSplitting),
			groups: 1 + (groups.length * faceSplitting),
			pivot: 3
		});

		var pixelCount = parameters + (vertices.length * 3) + (textures.length * 2) + (normals.length * 3) + ((faces.length * 3 * vertexSplitting) + (faces.length * 3 * textureSplitting) + (faces.length * 3 * normalSplitting));
		var square = Math.ceil(Math.sqrt(pixelCount));

		canvas.width = canvas.height = square;

		var vertexSplittingColor = OBJImg.fn.getColorFromValue(vertexSplitting);

		context.fillStyle = "rgba(" + vertexSplittingColor.r + ", " + vertexSplittingColor.g + ", " + vertexSplittingColor.b + ", " + vertexSplittingColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		var textureSplittingColor = OBJImg.fn.getColorFromValue(textureSplitting);

		context.fillStyle = "rgba(" + textureSplittingColor.r + ", " + textureSplittingColor.g + ", " + textureSplittingColor.b + ", " + textureSplittingColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		var normalSplittingColor = OBJImg.fn.getColorFromValue(normalSplitting);

		context.fillStyle = "rgba(" + normalSplittingColor.r + ", " + normalSplittingColor.g + ", " + normalSplittingColor.b + ", " + normalSplittingColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		var faceSplittingColor = OBJImg.fn.getColorFromValue(faceSplitting);

		context.fillStyle = "rgba(" + faceSplittingColor.r + ", " + faceSplittingColor.g + ", " + faceSplittingColor.b + ", " + faceSplittingColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		var vertexPass = 0;

		for( var pass = 0; pass < vertexSplitting; pass++ ){

			var vertexIndex = Math.min(vertices.length - vertexPass, MAX);
			var vertexColor = OBJImg.fn.getColorFromValue(vertexIndex);

			context.fillStyle = "rgba(" + vertexColor.r + ", " + vertexColor.g + ", " + vertexColor.b + ", " + vertexColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			vertexPass += vertexIndex;

		};

		var texturePass = 0;

		for( var pass = 0; pass < textureSplitting; pass++ ){

			var textureIndex = Math.min(textures.length - texturePass, MAX);
			var textureColor = OBJImg.fn.getColorFromValue(textureIndex);

			context.fillStyle = "rgba(" + textureColor.r + ", " + textureColor.g + ", " + textureColor.b + ", " + textureColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			texturePass += textureIndex;

		};

		var normalPass = 0;

		for( var pass = 0; pass < normalSplitting; pass++ ){

			var normalIndex = Math.min(normals.length - normalPass, MAX);
			var normalColor = OBJImg.fn.getColorFromValue(normalIndex);

			context.fillStyle = "rgba(" + normalColor.r + ", " + normalColor.g + ", " + normalColor.b + ", " + normalColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			normalPass += normalIndex;

		};

		var facePass = 0;

		for( var pass = 0; pass < faceSplitting; pass++ ){

			var faceIndex = Math.min(faces.length - facePass, MAX);
			var faceColor = OBJImg.fn.getColorFromValue(faceIndex);

			context.fillStyle = "rgba(" + faceColor.r + ", " + faceColor.g + ", " + faceColor.b + ", " + faceColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			facePass += faceIndex;

		};

		var vertexMultiplicatorColor = OBJImg.fn.getColorFromValue(MAX / (bounds.vertex.max.w + Math.abs(bounds.vertex.min.w)));
		var vertexMultiplicator = vertexMultiplicatorColor.r * vertexMultiplicatorColor.g + vertexMultiplicatorColor.b;

		context.fillStyle = "rgba(" + vertexMultiplicatorColor.r + ", " + vertexMultiplicatorColor.g + ", " + vertexMultiplicatorColor.b + ", 1)";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		if( textureSplitting > 0 ){


			var textureMultiplicatorColor = OBJImg.fn.getColorFromValue(MAX / Math.max((bounds.texture.max + Math.abs(bounds.texture.min)), 1));
			var textureMultiplicator = textureMultiplicatorColor.r * textureMultiplicatorColor.g + textureMultiplicatorColor.b;

			context.fillStyle = "rgba(" + textureMultiplicatorColor.r + ", " + textureMultiplicatorColor.g + ", " + textureMultiplicatorColor.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var textureOffsetColor = OBJImg.fn.getColorFromValue(Math.abs(bounds.texture.min) * textureMultiplicator);

			context.fillStyle = "rgba(" + textureOffsetColor.r + ", " + textureOffsetColor.g + ", " + textureOffsetColor.b + ", " + textureOffsetColor.a + ")";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

		};

		var objectsColor = OBJImg.fn.getColorFromValue(objects.length);

		context.fillStyle = "rgba(" + objectsColor.r + ", " + objectsColor.g + ", " + objectsColor.b + ", " + objectsColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		for( var object = 0, length = objects.length; object < length; object++ ){

			var objectPass = 0;

			for( var pass = 0; pass < faceSplitting; pass++ ){

				var objectIndex = Math.min(objects[object].index - objectPass, MAX);
				var objectColor = OBJImg.fn.getColorFromValue(objectIndex);

				context.fillStyle = "rgba(" + objectColor.r + ", " + objectColor.g + ", " + objectColor.b + ", " + objectColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				objectPass += objectIndex;

			};

		};

		var groupsColor = OBJImg.fn.getColorFromValue(groups.length);

		context.fillStyle = "rgba(" + groupsColor.r + ", " + groupsColor.g + ", " + groupsColor.b + ", " + groupsColor.a + ")";
		context.fillRect(pixelIndex, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		for( var group = 0, length = groups.length; group < length; group++ ){

			var groupPass = 0;

			for( var pass = 0; pass < faceSplitting; pass++ ){

				var groupIndex = Math.min(groups[group].index - groupPass, MAX);
				var groupColor = OBJImg.fn.getColorFromValue(groupIndex);

				context.fillStyle = "rgba(" + groupColor.r + ", " + groupColor.g + ", " + groupColor.b + ", " + groupColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				groupPass += groupIndex;

			};

		};

		var pivot = {
			x: Math.abs(bounds.vertex.min.x) * vertexMultiplicator,
			y: Math.abs(bounds.vertex.min.y) * vertexMultiplicator,
			z: Math.abs(bounds.vertex.min.z) * vertexMultiplicator
		};

		var pivotXColor = OBJImg.fn.getColorFromValue(pivot.x);

		context.fillStyle = "rgba(" + pivotXColor.r + ", " + pivotXColor.g + ", " + pivotXColor.b + ", " + pivotXColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		var pivotYColor = OBJImg.fn.getColorFromValue(pivot.y);

		context.fillStyle = "rgba(" + pivotYColor.r + ", " + pivotYColor.g + ", " + pivotYColor.b + ", " + pivotYColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		var pivotZColor = OBJImg.fn.getColorFromValue(pivot.z);

		context.fillStyle = "rgba(" + pivotZColor.r + ", " + pivotZColor.g + ", " + pivotZColor.b + ", " + pivotZColor.a + ")";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
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

			var previousPass = 0;

			for( var pass = 0; pass < vertexSplitting; pass++ ){

				var vaIndex = Math.min(faces[face].vertices.a - previousPass, MAX);
				var vaColor = OBJImg.fn.getColorFromValue(vaIndex);

				context.fillStyle = "rgba(" + vaColor.r + ", " + vaColor.g + ", " + vaColor.b + ", " + vaColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += vaIndex;

			};

			previousPass = 0;

			for( var pass = 0; pass < vertexSplitting; pass++ ){

				var vbIndex = Math.min(faces[face].vertices.b - previousPass, MAX);
				var vbColor = OBJImg.fn.getColorFromValue(vbIndex);

				context.fillStyle = "rgba(" + vbColor.r + ", " + vbColor.g + ", " + vbColor.b + ", " + vbColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += vbIndex;

			};

			previousPass = 0;

			for( var pass = 0; pass < vertexSplitting; pass++ ){

				var vcIndex = Math.min(faces[face].vertices.c - previousPass, MAX);
				var vcColor = OBJImg.fn.getColorFromValue(vcIndex);

				context.fillStyle = "rgba(" + vcColor.r + ", " + vcColor.g + ", " + vcColor.b + ", " + vcColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += vcIndex;

			};

			previousPass = 0; 

			for( var pass = 0; pass < textureSplitting; pass++ ){

				var taIndex = Math.min(faces[face].textures.a - previousPass, MAX);
				var taColor = OBJImg.fn.getColorFromValue(taIndex);

				context.fillStyle = "rgba(" + taColor.r + ", " + taColor.g + ", " + taColor.b + ", " + taColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += taIndex;

			};

			previousPass = 0;

			for( var pass = 0; pass < textureSplitting; pass++ ){

				var tbIndex = Math.min(faces[face].textures.b - previousPass, MAX);
				var tbColor = OBJImg.fn.getColorFromValue(tbIndex);

				context.fillStyle = "rgba(" + tbColor.r + ", " + tbColor.g + ", " + tbColor.b + ", " + tbColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += tbIndex;

			};

			previousPass = 0;

			for( var pass = 0; pass < textureSplitting; pass++ ){

				var tcIndex = Math.min(faces[face].textures.c - previousPass, MAX);
				var tcColor = OBJImg.fn.getColorFromValue(tcIndex);

				context.fillStyle = "rgba(" + tcColor.r + ", " + tcColor.g + ", " + tcColor.b + ", " + tcColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += tcIndex;

			};

			previousPass = 0;

			for( var pass = 0; pass < normalSplitting; pass++ ){

				var naIndex = Math.min(faces[face].normals.a - previousPass, MAX);
				var naColor = OBJImg.fn.getColorFromValue(naIndex);

				context.fillStyle = "rgba(" + naColor.r + ", " + naColor.g + ", " + naColor.b + ", " + naColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += naIndex;

			};

			previousPass = 0;

			for( var pass = 0; pass < normalSplitting; pass++ ){

				var nbIndex = Math.min(faces[face].normals.b - previousPass, MAX);
				var nbColor = OBJImg.fn.getColorFromValue(nbIndex);

				context.fillStyle = "rgba(" + nbColor.r + ", " + nbColor.g + ", " + nbColor.b + ", " + nbColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += nbIndex;

			};

			previousPass = 0;

			for( var pass = 0; pass < normalSplitting; pass++ ){

				var ncIndex = Math.min(faces[face].normals.c - previousPass, MAX);
				var ncColor = OBJImg.fn.getColorFromValue(ncIndex);

				context.fillStyle = "rgba(" + ncColor.r + ", " + ncColor.g + ", " + ncColor.b + ", " + ncColor.a + ")";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

				previousPass += ncIndex;

			};

		};

		return canvas.toDataURL("image/png", 1.0);

	};

	window.OBJImg = OBJImg;

})(this, this.document);