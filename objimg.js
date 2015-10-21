(function( window, document ){

	var insideWorker = self.document === undefined;
	var workerPath = (!insideWorker ? (Array.prototype.slice.call(document.querySelectorAll("script")).pop().getAttribute("src").split("/").slice(0, -1).join("/") + "/").replace(/^\//, "./") : "");

	var MAX = (255 * 255) + 255;
	var RGBA = 4;
	var XYZ = ABC = RGB = 3;
	var UV = 2;

	var charactersDictionnary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.-0123456789";

	var OBJImg = function( options ){

		return new OBJImg.fn.init(options);

	};

	OBJImg.fn = OBJImg.prototype = {
		constructor: OBJImg,
		init: function( options ){

			this.basePath = options.image.split("/").slice(0, -1).join("/") + "/";

			this.datas = null;

			this.canvas = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");

			this.object3D = window.THREE ? new window.THREE.Object3D() : null;
			this.updateObject3D = false;
			this.simpleObject3D = window.THREE ? new window.THREE.Object3D() : null;
			this.updateSimpleObject3D = false;
			this.onComplete = null;

			if( options.useWorker == true ){

				var worker = new Worker(workerPath + "objimg-worker.js");

				worker.addEventListener("message", function( event ){

					if( event.data.action == "progress" ){

						if( options.onProgress instanceof Function ){

							options.onProgress(event.data.content);

						};

					}
					else if( event.data.action == "convertImgToObj" ){

						this.datas = event.data.content;

						if( this.updateObject3D == true ){

							this.setObject3D();

						};

						if( this.updateSimpleObject3D == true ){

							this.setSimpleObject3D();

						};

						if( options.onLoad instanceof Function ){

							options.onLoad(this.datas);

						};

					};

				}.bind(this), false);

				worker.addEventListener("error", function( event ){

					if( options.onError instanceof Function ){

						options.onError("worker error");

					};

				}.bind(this), false);

			};

			if( options.image instanceof Image ){

				if( options.image.complete == true ){

					if( useWorker == true ){

						var pixelsBuffer = new Int16Array(this.getPixels(image));

						worker.postMessage({
							action: "convertImgToObj",
							content: pixelsBuffer
						}, [pixelsBuffer.buffer]);

					}
					else {

						this.datas = OBJImg.convertImgToObj(this.getPixels(options.image));

						if( this.updateObject3D == true ){

							this.setObject3D();

						};

						if( this.updateSimpleObject3D == true ){

							this.setSimpleObject3D();

						};

						if( options.onLoad instanceof Function ){

							options.onLoad(this.datas);

						};

					};

				}
				else {

					options.image.addEventListener("load", function( event ){

						if( useWorker == true ){

							var pixelsBuffer = new Int16Array(this.getPixels(image));

						worker.postMessage({
							action: "convertImgToObj",
							content: pixelsBuffer
						}, [pixelsBuffer.buffer]);

						}
						else {

							this.datas = OBJImg.convertImgToObj(this.getPixels(options.image));

							if( this.updateObject3D == true ){

								this.setObject3D();

							};

							if( this.updateSimpleObject3D == true ){

								this.setSimpleObject3D();

							};

							if( options.onLoad instanceof Function ){

								options.onLoad(this.datas);

							};

						};

					}.bind(this), false);

				};

			}
			else {

				var image = new Image();

				image.addEventListener("load", function( event ){

					if( options.useWorker == true ){

						var pixelsBuffer = new Int16Array(this.getPixels(image));

						worker.postMessage({
							action: "convertImgToObj",
							content: pixelsBuffer
						}, [pixelsBuffer.buffer]);

					}
					else {

						this.datas = OBJImg.convertImgToObj(this.getPixels(image));

						if( this.updateObject3D == true ){

							this.setObject3D();

						};

						if( this.updateSimpleObject3D == true ){

							this.setSimpleObject3D();

						};

						if( options.onLoad instanceof Function ){

							options.onLoad(this.datas);

						};

					};

				}.bind(this), false);

				image.src = options.image;

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

					var objectDatas = this.datas.objects[object];
					var verticesDatas = this.datas.vertices;
					var normalsDatas = this.datas.normals;
					var texturesDatas = this.datas.textures;

					var geometry = new THREE.Geometry();

					var sharedVertices = new Array();

					for( var face = 0, faceLength = objectDatas.faces.length; face < faceLength; face++ ){

						var faceID = objectDatas.faces[face];
						var verticesID = faceID.vertices;
						var normalsID = faceID.normals;
						var texturesID = faceID.textures;

						var vertexAID = sharedVertices.indexOf(verticesID.a);

						if( vertexAID == -1 ){

							vertexAID = sharedVertices.push(verticesID.a) - 1;

							var vertexA = verticesDatas[verticesID.a];

							geometry.vertices.push(new THREE.Vector3(vertexA.x, vertexA.y, vertexA.z));

						};

						var vertexBID = sharedVertices.indexOf(verticesID.b);

						if( vertexBID == -1 ){

							vertexBID = sharedVertices.push(verticesID.b) - 1;

							var vertexB = verticesDatas[verticesID.b];

							geometry.vertices.push(new THREE.Vector3(vertexB.x, vertexB.y, vertexB.z));

						};

						var vertexCID = sharedVertices.indexOf(verticesID.c);

						if( vertexCID == -1 ){

							vertexCID = sharedVertices.push(verticesID.c) - 1;

							var vertexC = verticesDatas[verticesID.c];

							geometry.vertices.push(new THREE.Vector3(vertexC.x, vertexC.y, vertexC.z));

						};

						var normals = null;

						if( normalsDatas.length > 0 ){

							normals = [
								normalsDatas[normalsID.a],
								normalsDatas[normalsID.b],
								normalsDatas[normalsID.c]
							];

						};

						geometry.faces.push(new THREE.Face3(vertexAID, vertexBID, vertexCID, normals));

						if( texturesDatas.length > 0 ){

							var uvA = texturesDatas[texturesID.a];
							var uvB = texturesDatas[texturesID.b];
							var uvC = texturesDatas[texturesID.c];

							geometry.faceVertexUvs[0].push([
								new THREE.Vector2(uvA.u, uvA.v),
								new THREE.Vector2(uvB.u, uvB.v),
								new THREE.Vector2(uvC.u, uvC.v)
							]);

						};

					};

					var materialDatas = this.datas.materials[objectDatas.material];

					var material = null;

					if( materialDatas != undefined ){

						var diffuseMap = null;

						if( materialDatas.diffuse.map != null ){

							diffuseMap = new THREE.ImageUtils.loadTexture(this.basePath + materialDatas.diffuse.map, THREE.UVMapping);
							diffuseMap.wrapS = diffuseMap.wrapT = (materialDatas.diffuse.clamp == true) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;

						};

						var ambientMap = null;

						if( materialDatas.ambient.map != null ){

							ambientMap = new THREE.ImageUtils.loadTexture(this.basePath + materialDatas.ambient.map, THREE.UVMapping);
							ambientMap.wrapS = ambientMap.wrapT = (materialDatas.ambient.clamp == true) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;

						};

						var specularMap = null;

						if( materialDatas.specular.map != null ){

							specularMap = new THREE.ImageUtils.loadTexture(this.basePath + materialDatas.specular.map, THREE.UVMapping);
							specularMap.wrapS = specularMap.wrapT = (materialDatas.specular.clamp == true) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;

						};

						var normalMap = null;

						if( materialDatas.bump.map != null ){

							normalMap = new THREE.ImageUtils.loadTexture(this.basePath + materialDatas.bump.map, THREE.UVMapping);
							normalMap.wrapS = normalMap.wrapT = (materialDatas.normal.clamp == true) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;

						};

						var bumpMap = null;

						if( materialDatas.bump.map != null ){

							bumpMap = new THREE.ImageUtils.loadTexture(this.basePath + materialDatas.bump.map, THREE.UVMapping);
							bumpMap.wrapS = bumpMap.wrapT = (materialDatas.bump.clamp == true) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;

						};

						var alphaMap = null;

						if( materialDatas.opacity.map != null ){

							alphaMap = new THREE.ImageUtils.loadTexture(this.basePath + materialDatas.opacity.map, THREE.UVMapping);
							alphaMap.wrapS = alphaMap.wrapT = (materialDatas.opacity.clamp == true) ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;

						};

						material = new THREE.MeshPhongMaterial({
							color: new THREE.Color(materialDatas.diffuse.r, materialDatas.diffuse.g, materialDatas.diffuse.b),
							aoMap: ambientMap,
							map: diffuseMap,
							specular: new THREE.Color(materialDatas.specular.r, materialDatas.specular.g, materialDatas.specular.b),
							specularMap: specularMap,
							shininess: materialDatas.specular.force,
							normalMap: normalMap,
							normalScale: new THREE.Vector2(1.0, 1.0),
							bumpMap: bumpMap,
							bumpScale: 1.0,
							opacity: materialDatas.opacity.value,
							alphaTest: 0,
							alphaMap: alphaMap,
							transparent: ((materialDatas.opacity.value < 1.0 || alphaMap != null) ? true : false),
							combine: THREE.MultiplyOperation,
							shading: (materialDatas.smooth == true ? THREE.SmoothShading : THREE.FlatShading),
							side: THREE.DoubleSide,
							fog: true
						});

					}
					else {

						material = new THREE.MeshPhongMaterial({
							color: new THREE.Color(0.4, 0.4, 0.4),
							specular: new THREE.Color(1, 1, 1),
							shininess: 10,
							fog: true
						});

					};

					var mesh = new THREE.Mesh(geometry, material);

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
				r: pixels[index * RGBA],
				g: pixels[index * RGBA + 1],
				b: pixels[index * RGBA + 2],
				a: pixels[index * RGBA + 3]
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

		var materials = new Array(OBJImg.fn.getPixelValue(pixelIndex++, pixels));

		for( var material = 0, length = materials.length; material < length; material++ ){

			var illumination = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var smooth = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			var ambientColor = OBJImg.fn.getPixelColor(pixelIndex++, pixels);
			var ambientMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var ambientClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			var ambientMap = "";

			for( var character = 0; character < ambientMapCharacters; character++ ){

				ambientMap += charactersDictionnary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

			};

			var diffuseColor = OBJImg.fn.getPixelColor(pixelIndex++, pixels);
			var diffuseMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var diffuseMap = "";
			var diffuseClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			for( var character = 0; character < diffuseMapCharacters; character++ ){

				diffuseMap += charactersDictionnary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

			};

			var specularColor = OBJImg.fn.getPixelColor(pixelIndex++, pixels);
			var specularMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var specularMap = "";
			var specularClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			for( var character = 0; character < specularMapCharacters; character++ ){

				specularMap += charactersDictionnary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

			};

			var specularForceMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var specularForceMap = "";
			var specularForceClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			for( var character = 0; character < specularForceMapCharacters; character++ ){

				specularForceMap += charactersDictionnary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

			};

			var specularForce = OBJImg.fn.getPixelValue(pixelIndex++, pixels) / (MAX / 1000);

			var normalMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var normalMap = "";
			var normalClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			for( var character = 0; character < normalMapCharacters; character++ ){

				normalMap += charactersDictionnary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

			};

			var bumpMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var bumpMap = "";
			var bumpClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			for( var character = 0; character < bumpMapCharacters; character++ ){

				bumpMap += charactersDictionnary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

			};

			var opacity = OBJImg.fn.getPixelValue(pixelIndex++, pixels) / 255;
			var opacityMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
			var opacityMap = "";
			var opacityClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1) ? true : false;

			for( var character = 0; character < opacityMapCharacters; character++ ){

				opacityMap += charactersDictionnary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

			};

			materials[material] = {
				illumination: illumination,
				smooth: smooth,
				ambient: {
					map: ambientMap || null,
					clamp: ambientClamp || false,
					r: ambientColor.r / 255,
					g: ambientColor.g / 255,
					b: ambientColor.b / 255
				},
				diffuse: {
					map: diffuseMap || null,
					clamp: diffuseClamp || false,
					r: diffuseColor.r / 255,
					g: diffuseColor.g / 255,
					b: diffuseColor.b / 255
				},
				specular: {
					map: specularMap || null,
					clamp: specularClamp || false,
					forceMap: specularForceMap || null,
					forceClamp: specularForceClamp || null,
					force: specularForce,
					r: specularColor.r / 255,
					g: specularColor.g / 255,
					b: specularColor.b / 255
				},
				normal: {
					map: normalMap || null,
					clamp: normalClamp || false
				},
				bump: {
					map: bumpMap || null,
					clamp: bumpClamp || false
				},
				opacity: {
					map: opacityMap || null,
					clamp: opacityClamp || false,
					value: opacity
				}
			};

		};

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

			var useMaterial = OBJImg.fn.getPixelColor(pixelIndex, pixels).a == 0 ? false : true;
			var materialID = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

			objects[object] = {
				index: objectIndex,
				faces: new Array(),
				material: (useMaterial == true ? materialID : null)
			};

		};

		var pivot = {
			x: OBJImg.fn.getPixelValue(pixelIndex++, pixels) / vertexMultiplicator,
			y: OBJImg.fn.getPixelValue(pixelIndex++, pixels) / vertexMultiplicator,
			z: OBJImg.fn.getPixelValue(pixelIndex++, pixels) / vertexMultiplicator
		};

		for( var vertex = 0, length = vertices.length; vertex < length; vertex++, pixelIndex += XYZ ){

			var x = (OBJImg.fn.getPixelValue(pixelIndex, pixels) / vertexMultiplicator) - pivot.x;
			var y = (OBJImg.fn.getPixelValue(pixelIndex + 1, pixels) / vertexMultiplicator) - pivot.y;
			var z = (OBJImg.fn.getPixelValue(pixelIndex + 2, pixels) / vertexMultiplicator) - pivot.z;

			vertices[vertex] = {
				x: x,
				y: y,
				z: z
			};

		};

		for( var texture = 0, length = textures.length; texture < length; texture++, pixelIndex += UV ){

			var u = (OBJImg.fn.getPixelValue(pixelIndex, pixels) / textureMultiplicator) - textureOffset;
			var v = (OBJImg.fn.getPixelValue(pixelIndex + 1, pixels) / textureMultiplicator) - textureOffset;

			textures[texture] = {
				u: u,
				v: v
			};

		};

		for( var normal = 0, length = normals.length; normal < length; normal++, pixelIndex += XYZ ){

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
			materials: materials,
			objects: objects
		};

	};

	OBJImg.generateImg = function( options ){

		var isURL = !/[\n\s]/.test(options.obj);
		var useMTL = (options.mtl == undefined) ? false : true;

		var isOBJLoaded = false;
		var isMTLLoaded = !useMTL;

		if( isURL == true ){

			var OBJRequest = new XMLHttpRequest();

			OBJRequest.addEventListener("readystatechange", function( event ){

				if( this.readyState == 4 && this.status >= 200 && this.status < 400 ){

					var obj = this.responseText;

					var mtlFile = (options.mtl || (obj.match(/(?:\n|^)\s*mtllib\s([^\n\r]+)/) || [])[1]);

					if( mtlFile != undefined ){

						var MTLRequest = new XMLHttpRequest();

						MTLRequest.addEventListener("readystatechange", function( event ){

							if( this.readyState == 4 && this.status >= 200 && this.status < 400 ){

								var mtl = this.responseText;

								options.done(OBJImg.convertObjToImg(obj, mtl));

							}
							else if( this.readyState == 4 ){

								options.fail("Cant load mtl");

							};

						}, false);

						MTLRequest.open("GET", options.obj.split("/").slice(0, -1).join("/") + "/" + mtlFile, true);
						MTLRequest.send(null);


					}
					else {

						options.done(OBJImg.convertObjToImg(obj, ""));

					};

				}
				else if( this.readyState == 4 ){

					options.fail("Cant load obj");

				};

			}, false);

			OBJRequest.open("GET", options.obj, true);
			OBJRequest.send(null);

		}
		else {

			options.done(OBJImg.convertObjToImg(options.obj, options.mtl));

		};

		return this;

	};

	OBJImg.convertObjToImg = function( obj, mtl ){

		var MTLLines = mtl.split(/\n/g);
		var materials = new Array();
		var materialsID = new Array();

		for( var line = 0, length = MTLLines.length, index = -1; line < length; line++ ){

			var datas = MTLLines[line].split(/\s+(?!$)/g);
			var type = datas[0].replace(/\s+/, "").toLowerCase();

			if( type == "newmtl" ){

				index++;

				materialsID[index] = datas[1];

				materials[index] = {
					illumination: 2,
					smooth: true,
					ambient: {
						map: [],
						clamp: false,
						r: 1.0,
						g: 1.0,
						b: 1.0
					},
					diffuse: {
						map: [],
						clamp: false,
						r: 1.0,
						g: 1.0,
						b: 1.0
					},
					specular: {
						map: [],
						clamp: false,
						forceMap: [],
						forceClamp: false,
						force: 1.0,
						r: 1.0,
						g: 1.0,
						b: 1.0
					},
					normal: {
						map: [],
						clamp: false
					},
					bump: {
						map: [],
						clamp: false
					},
					opacity: {
						map: [],
						clamp: false,
						value: 1.0
					}
				};

			}
			else if( type == "ka" ){

				materials[index].ambient.r = parseFloat(datas[1]);
				materials[index].ambient.g = parseFloat(datas[2]);
				materials[index].ambient.b = parseFloat(datas[3]);

			}
			else if( type == "kd" ){

				materials[index].diffuse.r = parseFloat(datas[1]);
				materials[index].diffuse.g = parseFloat(datas[2]);
				materials[index].diffuse.b = parseFloat(datas[3]);

			}
			else if( type == "ks" ){

				materials[index].specular.r = parseFloat(datas[1]);
				materials[index].specular.g = parseFloat(datas[2]);
				materials[index].specular.b = parseFloat(datas[3]);

			}
			else if( type == "ns" ){

				materials[index].specular.force = parseFloat(datas[1]);

			}
			else if( type == "d" ){

				materials[index].opacity.value = parseFloat(datas[1]);

			}
			else if( type == "illum" ){

				materials[index].illumination = parseInt(datas[1]);

			}
			else if( type == "s" ){

				materials[index].smooth = (datas[1] == "off" || parseInt(datas[1]) == 0) ? false : true;

			}
			else if( type == "ni" ){

				// Optical density (refraction)

			}
			else if( type.substr(0, 3) == "map" && datas.length > 1 ){

				var map = datas[datas.length - 1] || null;
				var encodedMap = new Array();

				if( map != null ){

					for( var character = 0, characterLength = map.length; character < characterLength; character++ ){

						encodedMap[character] = charactersDictionnary.indexOf(map[character]);

					};

				};

				var options = {
					clamp: true
				};

				for( var option = 1, optionLength = datas.length; option < optionLength; option++ ){

					var optionType = datas[option];

					if( optionType == "-clamp" ){

						var value = datas[++option];

						if( value == "off" || parseInt(value) == 0 ){

							options.clamp = false;

						};

					};

				};

				if( type == "map_ka" ){

					materials[index].ambient.map = encodedMap;
					materials[index].ambient.clamp = options.clamp;

				}
				else if( type == "map_kd" ){

					materials[index].diffuse.map = encodedMap;
					materials[index].diffuse.clamp = options.clamp;

				}
				else if( type == "map_ks" ){

					materials[index].specular.map = encodedMap;
					materials[index].specular.clamp = options.clamp;

				}
				else if( type == "map_ns" ){

					materials[index].specular.forceMap = encodedMap;
					materials[index].specular.forceClamp = options.clamp;

				}
				else if( type == "map_kn" ){

					materials[index].normal.map = encodedMap;
					materials[index].normal.clamp = options.clamp;

				}
				else if( type == "map_bump" ){

					materials[index].bump.map = encodedMap;
					materials[index].bump.clamp = options.clamp;

				}
				else if( type == "map_d" ){

					materials[index].opacity.map = encodedMap;
					materials[index].opacity.clamp = options.clamp;

				};

			};

		};

		var OBJLines = obj.split(/\n/g);
		var objects = new Array();
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

		for( var line = 0, length = OBJLines.length; line < length; line++ ){

			var datas = OBJLines[line].split(/\s+/g);
			var type = datas[0].toLowerCase();

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
			else if( type == "o" || type == "g" ){

				objects.push({
					name: datas[1],
					material: null,
					index: faces.length
				});

			}
			else if( type == "usemtl" ){

				objects[objects.length - 1].material = materialsID.indexOf(datas[1]);

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
			materials: 1 + (materials.length * 9 * 2),
			vertexMultiplicator: 1,
			textureMultiplicator: (textureSplitting > 0 ? 1 : 0),
			textureOffset: (textureSplitting > 0 ? 1 : 0),
			objects: 1 + (objects.length * faceSplitting),
			pivot: 3
		});

		var pixelCount = parameters 
			+ (vertices.length * XYZ)
			+ (textures.length * UV)
			+ (normals.length * XYZ)
			+ ((faces.length * ABC * vertexSplitting) + (faces.length * ABC * textureSplitting) + (faces.length * ABC * normalSplitting));

		for( var material = 0, length = materials.length; material < length; material++ ){

			pixelCount += 3 * RGB;
			pixelCount += materials[material].ambient.map.length;
			pixelCount += materials[material].diffuse.map.length;
			pixelCount += materials[material].specular.map.length;
			pixelCount += materials[material].specular.forceMap.length;
			pixelCount += materials[material].normal.map.length;
			pixelCount += materials[material].bump.map.length;
			pixelCount += materials[material].opacity.map.length;

		};

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

		var materialColor = OBJImg.fn.getColorFromValue(materials.length);

		context.fillStyle = "rgba(" + materialColor.r + ", " + materialColor.g + ", " + materialColor.b + ", 1)";
		context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
		pixelIndex++;

		for( var material = 0, length = materials.length; material < length; material++ ){

			context.fillStyle = "rgba(0, 0, " + materials[material].illumination + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].smooth == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var ambientRedColor = Math.round(materials[material].ambient.r * 255);
			var ambientGreenColor = Math.round(materials[material].ambient.g * 255);
			var ambientBlueColor = Math.round(materials[material].ambient.b * 255);

			context.fillStyle = "rgba(" + ambientRedColor + ", " + ambientGreenColor + ", " + ambientBlueColor + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var ambientMapCharacters = OBJImg.fn.getColorFromValue(materials[material].ambient.map.length);

			context.fillStyle = "rgba(" + ambientMapCharacters.r + ", " + ambientMapCharacters.g + ", " + ambientMapCharacters.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].ambient.clamp == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			for( var character = 0, characterLength = materials[material].ambient.map.length; character < characterLength; character++ ){

				var characterColor = OBJImg.fn.getColorFromValue(materials[material].ambient.map[character]);

				context.fillStyle = "rgba(" + characterColor.r + ", " + characterColor.g + ", " + characterColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			};

			var diffuseRedColor = Math.round(materials[material].diffuse.r * 255);
			var diffuseGreenColor = Math.round(materials[material].diffuse.g * 255);
			var diffuseBlueColor = Math.round(materials[material].diffuse.b * 255);

			context.fillStyle = "rgba(" + diffuseRedColor + ", " + diffuseGreenColor + ", " + diffuseBlueColor + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var diffuseMapCharacters = OBJImg.fn.getColorFromValue(materials[material].diffuse.map.length);

			context.fillStyle = "rgba(" + diffuseMapCharacters.r + ", " + diffuseMapCharacters.g + ", " + diffuseMapCharacters.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].diffuse.clamp == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			for( var character = 0, characterLength = materials[material].diffuse.map.length; character < characterLength; character++ ){

				var characterColor = OBJImg.fn.getColorFromValue(materials[material].diffuse.map[character]);

				context.fillStyle = "rgba(" + characterColor.r + ", " + characterColor.g + ", " + characterColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			};

			var specularRedColor = Math.round(materials[material].specular.r * 255);
			var specularGreenColor = Math.round(materials[material].specular.g * 255);
			var specularBlueColor = Math.round(materials[material].specular.b * 255);

			context.fillStyle = "rgba(" + specularRedColor + ", " + specularGreenColor + ", " + specularBlueColor + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var specularMapCharacters = OBJImg.fn.getColorFromValue(materials[material].specular.map.length);

			context.fillStyle = "rgba(" + specularMapCharacters.r + ", " + specularMapCharacters.g + ", " + specularMapCharacters.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].specular.clamp == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			for( var character = 0, characterLength = materials[material].specular.map.length; character < characterLength; character++ ){

				var characterColor = OBJImg.fn.getColorFromValue(materials[material].specular.map[character]);

				context.fillStyle = "rgba(" + characterColor.r + ", " + characterColor.g + ", " + characterColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			};

			var specularForceMapCharacters =  OBJImg.fn.getColorFromValue(materials[material].specular.forceMap.length);

			context.fillStyle = "rgba(" + specularForceMapCharacters.r + ", " + specularForceMapCharacters.g + ", " + specularForceMapCharacters.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].specular.forceClamp == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			for( var character = 0, characterLength = materials[material].specular.forceMap.length; character < characterLength; character++ ){

				var characterColor = OBJImg.fn.getColorFromValue(materials[material].specular.forceMap[character]);

				context.fillStyle = "rgba(" + characterColor.r + ", " + characterColor.g + ", " + characterColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			};

			var specularForceColor = OBJImg.fn.getColorFromValue(materials[material].specular.force * (MAX / 1000));

			context.fillStyle = "rgba(" + specularForceColor.r + ", " + specularForceColor.g + ", " + specularForceColor.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var normalMapCharacters = OBJImg.fn.getColorFromValue(materials[material].normal.map.length);

			context.fillStyle = "rgba(" + normalMapCharacters.r + ", " + normalMapCharacters.g + ", " + normalMapCharacters.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].normal.clamp == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			for( var character = 0, characterLength = materials[material].normal.map.length; character < characterLength; character++ ){

				var characterColor = OBJImg.fn.getColorFromValue(materials[material].normal.map[character]);

				context.fillStyle = "rgba(" + characterColor.r + ", " + characterColor.g + ", " + characterColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			};

			var bumpMapCharacters = OBJImg.fn.getColorFromValue(materials[material].bump.map.length);

			context.fillStyle = "rgba(" + bumpMapCharacters.r + ", " + bumpMapCharacters.g + ", " + bumpMapCharacters.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].bump.clamp == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			for( var character = 0, characterLength = materials[material].bump.map.length; character < characterLength; character++ ){

				var characterColor = OBJImg.fn.getColorFromValue(materials[material].bump.map[character]);

				context.fillStyle = "rgba(" + characterColor.r + ", " + characterColor.g + ", " + characterColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			};

			var opacityColor = OBJImg.fn.getColorFromValue(materials[material].opacity.value * 255);

			context.fillStyle = "rgba(" + opacityColor.r + ", " + opacityColor.g + ", " + opacityColor.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			var opacityMapCharacters =  OBJImg.fn.getColorFromValue(materials[material].opacity.map.length);

			context.fillStyle = "rgba(" + opacityMapCharacters.r + ", " + opacityMapCharacters.g + ", " + opacityMapCharacters.b + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			context.fillStyle = "rgba(0, 0, " + (materials[material].opacity.clamp == true ? 1 : 0) + ", 1)";
			context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
			pixelIndex++;

			for( var character = 0, characterLength = materials[material].opacity.map.length; character < characterLength; character++ ){

				var characterColor = OBJImg.fn.getColorFromValue(materials[material].opacity.map[character]);

				context.fillStyle = "rgba(" + characterColor.r + ", " + characterColor.g + ", " + characterColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			};

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

			if( objects[object].material != null ){

				var materialColor = OBJImg.fn.getColorFromValue(objects[object].material);

				context.fillStyle = "rgba(" + materialColor.r + ", " + materialColor.g + ", " + materialColor.b + ", 1)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

			}
			else {

				context.fillStyle = "rgba(0, 0, 0, 0)";
				context.fillRect(pixelIndex % square, Math.floor(pixelIndex / square), 1, 1);
				pixelIndex++;

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