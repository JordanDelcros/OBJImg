(function( self ){

	"use strict";

	var INSIDE_WORKER = (self.document == undefined ? true : false);

	var SCRIPT_PATH = (INSIDE_WORKER == false ? Array.prototype.slice.call(document.querySelectorAll("script")).pop().src.split(/\//g).slice(0, -1).join("/") : "");
	
	var USE_THREE = (typeof THREE == "undefined" ? false : true);
	
	var SUPPORT_WORKER = (self.Worker != undefined);

	if( INSIDE_WORKER == false && SUPPORT_WORKER == true ){

		var WORKER_URL = (function(){

			var blob = new Blob(["(" + function( SCRIPT_PATH ){

				self.importScripts(SCRIPT_PATH + "/objimg.js");

				self.addEventListener("message", function( event ){

					var action = event.data.action;

					if( action == "convertIMG" ){

						var datas = OBJImg.convertIMG(event.data.content);

						postMessage({
							action: event.data.action,
							content: datas
						});

					}
					else if( action == "convertOBJ" ){

						var datas = OBJImg.convertOBJ(event.data.content[0], event.data.content[1]);

						postMessage({
							action: event.data.action,
							content: datas
						}, [datas.buffer]);

					};

				}, false);

			}.toString() + ")('" + SCRIPT_PATH + "')"]);

			return window.URL.createObjectURL(blob);

		})();

	};

	var MAX = (255 * 255) + 255;
	var RGBA = 4;
	var XYZ = 3;
	var ABC = 3;
	var RGB = 3;
	var UV = 2;

	var OBJImg = function( options ){

		return new OBJImg.fn.init(options);

	};

	OBJImg.fn = OBJImg.prototype = {
		constructor: OBJImg,
		init: function( options ){

			this.datas = null;

			Object.defineProperty(this, "canvas", {
				configurable: false,
				writable: false,
				enumerable: false,
				value: document.createElement("canvas")
			});

			Object.defineProperty(this, "context", {
				configurable: false,
				writable: false,
				enumerable: false,
				value: this.canvas.getContext("2d")
			});

			Object.defineProperty(this, "events", {
				configurable: false,
				writable: false,
				enumerable: false,
				value: new Array()
			});

			Object.defineProperty(this, "ready", {
				configurable: false,
				writable: true,
				enumerable: false,
				value: false
			});

			if( USE_THREE == true ){

				Object.defineProperty(this, "gl", {
					configurable: false,
					writable: false,
					enumerable: false,
					value: (options.renderer || new THREE.WebGLRenderer())
				});

				Object.defineProperty(this, "object3D", {
					configurable: false,
					writable: false,
					enumerable: false,
					value: new THREE.Object3D()
				});

				Object.defineProperty(this, "object3DNeedsUpdate", {
					configurable: false,
					writable: true,
					enumerable: false,
					value: false
				});

				Object.defineProperty(this, "object3DComplete", {
					configurable: false,
					writable: true,
					enumerable: false,
					value: null
				});

				Object.defineProperty(this, "simpleObject3D", {
					configurable: false,
					writable: false,
					enumerable: false,
					value: new THREE.Object3D()
				});

				Object.defineProperty(this, "simpleObject3DNeedsUpdate", {
					configurable: false,
					writable: true,
					enumerable: false,
					value: false
				});

				Object.defineProperty(this, "simpleObject3DComplete", {
					configurable: false,
					writable: true,
					enumerable: false,
					value: null
				});

			};

			this.addEventListener("parse", function( event ){

				this.datas = event.detail;

				var toLoad = 0;
				var loaded = 0;

				for( var materialIndex = 0, length = this.datas.materials.length; materialIndex < length; materialIndex++ ){

					var material = this.datas.materials[materialIndex];

					if( material.shader.vertex != null ){

						toLoad++;

						new FileLoader(this.basePath + "/" + material.shader.vertex, function( materialIndex, data ){

							loaded++;

							this.datas.materials[materialIndex].shader.vertex = data;

							if( loaded == toLoad ){

								var readyEvent = document.createEvent("CustomEvent");
								readyEvent.initCustomEvent("ready", true, true, this.datas);

								this.dispatchEvent(readyEvent);

							};

						}.bind(this, materialIndex), function( error ){

							var errorEvent = document.createEvent("CustomEvent");
							errorEvent.initCustomEvent("error", true, true, "Cant load vertex shader (error " + error + ")");

							this.dispatchEvent(errorEvent);

						}.bind(this));

					};

					if( material.shader.fragment != null ){

						toLoad++;

						new FileLoader(this.basePath + "/" + material.shader.fragment, function( materialIndex, data ){

							loaded++;

							this.datas.materials[materialIndex].shader.fragment = data;

							if( loaded == toLoad ){

								var readyEvent = document.createEvent("CustomEvent");
								readyEvent.initCustomEvent("ready", true, true, this.datas);

								this.dispatchEvent(readyEvent);

							};

						}.bind(this, materialIndex), function( error ){

							var errorEvent = document.createEvent("CustomEvent");
							errorEvent.initCustomEvent("error", true, true, "Cant load fragment shader (error " + error + ")");

							this.dispatchEvent(errorEvent);

						}.bind(this));

					};

					for( var materialType in material ){

						var type = material[materialType];

						for( var materialParameter in type ){

							if( typeof type[materialParameter] == "string" && /\.(png|jpg|gif)$/.test(type[materialParameter]) ){

								var map = type[materialParameter];

								toLoad++;

								new ImageParser(this.basePath + "/" + map, type.channel, function( materialIndex, materialType, materialParameter, image ){

									loaded++;

									this.datas.materials[materialIndex][materialType][materialParameter] = image;

									if( loaded == toLoad ){

										var readyEvent = document.createEvent("CustomEvent");
										readyEvent.initCustomEvent("ready", true, true, this.datas);

										this.dispatchEvent(readyEvent);

									};

								}.bind(this, materialIndex, materialType, materialParameter));

							};

						};

					};

				};

				if( toLoad == 0 ){

					var readyEvent = document.createEvent("CustomEvent");
					readyEvent.initCustomEvent("ready", true, true, this.datas);

					this.dispatchEvent(readyEvent);

				};

			}.bind(this));

			this.addEventListener("ready", function( event ){

				this.ready = true;

				if( this.object3DNeedsUpdate == true ){

					this.setObject3D(this.object3DComplete);

				};

				if( this.simpleObject3DNeedsUpdate == true ){

					this.setSimpleObject3D(this.simpleObject3DComplete);

				};

				var completeEvent = document.createEvent("CustomEvent");
				completeEvent.initCustomEvent("complete", true, true, this.datas);

				this.dispatchEvent(completeEvent);

			}.bind(this));

			if( options.onComplete instanceof Function ){

				this.addEventListener("complete", options.onComplete.bind(this));

			};

			if( options.onError instanceof Function ){

				this.addEventListener("error", options.onError.bind(this));

			};

			if( options.useWorker == true ){

				var worker = new Worker(WORKER_URL);

				worker.addEventListener("message", function( event ){

					var action = event.data.action;

					if( action == "convertIMG" ){

						var parsedEvent = document.createEvent("CustomEvent");
						parsedEvent.initCustomEvent("parse", true, true, event.data.content);

						this.dispatchEvent(parsedEvent);

					};

				}.bind(this), false);

				worker.addEventListener("error", function( event ){

					var errorEvent = document.createEvent("CustomEvent");
					errorEvent.initCustomEvent("error", true, true, "worker error");

					this.dispatchEvent(errorEvent);

				}.bind(this), false);

			};

			if( options.image instanceof Image ){

				Object.defineProperty(this, "basePath", {
					configurable: false,
					enumerable: true,
					writable: false,
					value: options.image.getAttribute("src").split("/").slice(0, -1).join("/")
				});

				if( options.image.complete == true ){

					if( options.useWorker == true ){

						var pixelsBuffer = new Int16Array(this.getPixels(options.image));

						worker.postMessage({
							action: "convertIMG",
							content: pixelsBuffer
						}, [pixelsBuffer.buffer]);

					}
					else {

						var parsedEvent = document.createEvent("CustomEvent");
						parsedEvent.initCustomEvent("parse", true, true, OBJImg.convertIMG(this.getPixels(options.image)));

						this.dispatchEvent(parsedEvent);

					};

				}
				else {

					options.image.addEventListener("load", function( event ){

						if( options.useWorker == true ){

							var pixelsBuffer = new Int16Array(this.getPixels(image));

							worker.postMessage({
								action: "convertIMG",
								content: pixelsBuffer
							}, [pixelsBuffer.buffer]);

						}
						else {

							var parsedEvent = document.createEvent("CustomEvent");
							parsedEvent.initCustomEvent("parse", true, true, OBJImg.convertIMG(this.getPixels(options.image)));

							this.dispatchEvent(parsedEvent);

						};

					}.bind(this), false);

				};

			}
			else {

				Object.defineProperty(this, "basePath", {
					configurable: false,
					enumerable: true,
					writable: false,
					value: options.image.split("/").slice(0, -1).join("/")
				});

				var image = new Image();

				image.addEventListener("load", function( event ){

					if( options.useWorker == true ){

						var pixelsBuffer = new Int16Array(this.getPixels(image));

						worker.postMessage({
							action: "convertIMG",
							content: pixelsBuffer
						}, [pixelsBuffer.buffer]);

					}
					else {

						var parsedEvent = document.createEvent("CustomEvent");
						parsedEvent.initCustomEvent("parse", true, true, OBJImg.convertIMG(this.getPixels(image)));

						this.dispatchEvent(parsedEvent);

					};

				}.bind(this), false);

				image.src = options.image;

			};

			return this;

		},
		addEventListener: function( type, listener ){

			this.events.push({
				type: type,
				listener: listener
			});

		},
		removeEventListener: function( type, listener ){

			for( var eventIndex = 0, length = this.events.length; eventIndex < length; eventIndex++ ){

				if( this.events[eventIndex].type == type && this.events[eventIndex].listener == listener ){

					this.events.splice(eventIndex, 1);

				};

			};

		},
		dispatchEvent: function( event ){

			for( var eventIndex = 0, length = this.events.length; eventIndex < length; eventIndex++ ){

				if( this.events[eventIndex].type == event.type ){

					this.events[eventIndex].listener(event);

				};

			};

		},
		setObject3D: function( onComplete ){

			if( this.datas != null && USE_THREE == true ){

				var anisotropy = this.gl.getMaxAnisotropy();

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

						var ambientMap = null;
						if( materialDatas.ambient.map != null ){

							var wrapMode = (materialDatas.ambient.clamp == true ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping);

							ambientMap = new THREE.Texture(materialDatas.ambient.map, THREE.UVMapping, wrapMode, wrapMode, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, anisotropy);
							ambientMap.needsUpdate = true;

						};

						var diffuseMap = null;
						if( materialDatas.diffuse.map != null ){

							var wrapMode = (materialDatas.diffuse.clamp == true ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping);

							diffuseMap = new THREE.Texture(materialDatas.diffuse.map, THREE.UVMapping, wrapMode, wrapMode, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, anisotropy);
							diffuseMap.needsUpdate = true;

						};

						var specularMap = null;
						if( materialDatas.specular.map != null ){

							var wrapMode = (materialDatas.specular.clamp == true ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping);

							specularMap = new THREE.Texture(materialDatas.specular.map, THREE.UVMapping, wrapMode, wrapMode, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, anisotropy);
							specularMap.needsUpdate = true;

						};

						var normalMap = null;
						if( materialDatas.normal.map != null ){

							var wrapMode = (materialDatas.normal.clamp == true ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping);

							normalMap = new THREE.Texture(materialDatas.normal.map, THREE.UVMapping, wrapMode, wrapMode, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, anisotropy);
							normalMap.needsUpdate = true;

						};

						var bumpMap = null;
						if( materialDatas.bump.map != null ){

							var wrapMode = (materialDatas.bump.clamp == true ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping);

							bumpMap = new THREE.Texture(materialDatas.bump.map, THREE.UVMapping, wrapMode, wrapMode, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, anisotropy);
							bumpMap.needsUpdate = true;

						};

						var opacityMap = null;
						if( materialDatas.opacity.map != null ){

							var wrapMode = (materialDatas.opacity.clamp == true ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping);

							opacityMap = new THREE.Texture(materialDatas.opacity.map, THREE.UVMapping, wrapMode, wrapMode, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, anisotropy);
							opacityMap.needsUpdate = true;

						};

						var environementMap = null;
						if( materialDatas.environement.map != null ){

							var wrapMode = (materialDatas.environement.clamp == true ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping);

							environementMap = new THREE.Texture(materialDatas.environement.map, THREE.SphericalReflectionMapping, wrapMode, wrapMode, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBAFormat, THREE.UnsignedByteType, anisotropy);
							environementMap.needsUpdate = true;

						};

						var diffuseColor = new THREE.Color(materialDatas.diffuse.r, materialDatas.diffuse.g, materialDatas.diffuse.b);
						var specularColor = new THREE.Color(materialDatas.specular.r, materialDatas.specular.g, materialDatas.specular.b);
						var normalScale = new THREE.Vector2(0.5, 0.5);
						var bumpScale = 1.0;
						var transparent = ((materialDatas.opacity.value < 1.0 || opacityMap != null) ? true : false);
						var depthTest = materialDatas.shader.depthTest;
						var depthWrite = materialDatas.shader.depthWrite;
						var shading = (materialDatas.smooth == OBJImg.constants.shading.smooth ? THREE.SmoothShading : THREE.FlatShading);
						var side = (materialDatas.shader.side == OBJImg.constants.side.front ? THREE.FrontSide : (materialDatas.shader.side == OBJImg.constants.side.back ? THREE.BackSide : THREE.DoubleSide));
						var fog = true;

						if( materialDatas.shader.vertex != null || materialDatas.shader.fragment != null ){

							material = new THREE.ShaderMaterial({
								uniforms: {
									aoMap: {
										type: "t",
										value: ambientMap
									},
									aoMapIntensity: {
										type: "f",
										value: 1
									},
									diffuse: {
										type: "c",
										value: diffuseColor
									},
									map: {
										type: "t",
										value: diffuseMap
									},
									normalMap: {
										type: "t",
										value: normalMap
									},
									normalScale: {
										type: "v2",
										value: normalScale
									},
									specular: {
										type: "c",
										value: specularColor
									},
									specularMap: {
										type: "t",
										value: specularMap
									},
									bumpMap: {
										type: "t",
										value: bumpMap
									},
									bumpScale: {
										type: "f",
										value: bumpScale
									},
									alphaMap: {
										type: "t",
										value: opacityMap
									},
									opacity: {
										type: "f",
										value: materialDatas.opacity.value
									},
									shininess: {
										type: "f",
										value: materialDatas.specular.force
									},
									displacementBias: {
										type: "f",
										value: 0
									},
									displacementMap: {
										type: "t",
										value: null
									},
									displacementScale: {
										type: "f",
										value: 1
									},
									emmisive: {
										type: "c",
										value: new THREE.Color(0, 0, 0)
									},
									emissiveMap: {
										type: "t",
										value: null
									},
									envMap: {
										type: "t",
										value: environementMap
									},
									flipEnvMap: {
										type: "f",
										value: -1
									},
									fogColor: {
										type: "c",
										value: new THREE.Color(1, 1, 1)
									},
									fogDensity: {
										type: "f",
										value: 0.00025
									},
									fogFar: {
										type: "f",
										value: 2000
									},
									fogNear: {
										type: "f",
										value: 1
									},
									lightMap: {
										type: "t",
										value: null
									},
									offsetRepeat: {
										type: "v4",
										value: new THREE.Vector4(0, 0, 1, 1)
									},
									reflectivity: {
										type: "f",
										value: materialDatas.environement.reflectivity
									},
									reflectionRatio: {
										type: "f",
										value: 0.98
									},
									shadowBias: {
										type: "fv1",
										value: []
									},
									shadowDarkness: {
										type: "fv1",
										value: []
									},
									shadowMap: {
										type: "tv",
										value: []
									},
									shadowMapSize: {
										type: "v2v",
										value: []
									},
									shadowMatrix: {
										type: "m4v",
										value: []
									},
									ambientLightColor: {
										type: "fv",
										value: []
									},
									pointLightColor: {
										type: "fv",
										value: []
									},
									pointLightDecay: {
										type: "fv1",
										value: []
									},
									pointLightDistance: {
										type: "fv1",
										value: []
									},
									pointLightPosition: {
										type: "fv",
										value: []
									},
									spotLightAngleCos: {
										type: "fv1",
										value: []
									},
									spotLightColor: {
										type: "fv",
										value: []
									},
									spotLightDecay: {
										type: "fv1",
										value: []
									},
									spotLightDirection: {
										type: "fv",
										value: []
									},
									spotLightDistance: {
										type: "fv1",
										value: []
									},
									spotLightExponent: {
										type: "fv1",
										value: []
									},
									spotLightPosition: {
										type: "fv",
										value: []
									},
									directionalLightColor: {
										type: "fv",
										value: []
									},
									directionalLightDirection: {
										type: "fv",
										value: []
									},
									hemisphereLightDirection: {
										type: "fv",
										value: []
									},
									hemisphereLightGroundColor: {
										type: "fv",
										value: []
									},
									hemisphereLightSkyColor: {
										type: "fv",
										value: []
									}
								},
								vertexShader: materialDatas.shader.vertex,
								fragmentShader: materialDatas.shader.fragment,
								alphaTest: materialDatas.opacity.test,
								transparent: transparent,
								side: side,
								shading: shading,
								depthTest: depthTest,
								depthWrite: depthWrite,
								lights: true,
								fog: true
							});

							material.aoMap = (ambientMap != null ? true : false);
							material.map = (diffuseMap != null ? true : false);
							material.normalMap = (normalMap != null ? true : false);
							material.specularMap = (specularMap != null ? true : false);
							material.bumpMap = (bumpMap != null ? true : false);
							material.alphaMap = (opacityMap != null ? true : false);
							material.displacementMap = false;
							material.emissiveMap = false;
							material.envMap = (environementMap != null ? true : false);
							material.lightMap = false;

							material.needsUpdate = true;

						}
						else {

							material = new THREE.MeshPhongMaterial({
								aoMap: ambientMap,
								color: diffuseColor,
								map: diffuseMap,
								specularMap: specularMap,
								specular: specularColor,
								shininess: materialDatas.specular.force,
								normalMap: normalMap,
								normalScale: normalScale,
								bumpMap: bumpMap,
								bumpScale: bumpScale,
								envMap: environementMap,
								reflectivity: materialDatas.environement.reflectivity,
								opacity: materialDatas.opacity.value,
								alphaMap: opacityMap,
								alphaTest: materialDatas.opacity.test,
								transparent: transparent,
								depthTest: depthTest,
								depthWrite: depthWrite,
								combine: THREE.MultiplyOperation,
								shading: shading,
								side: side,
								fog: fog
							});

						};

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

					mesh.name = this.datas.objects[object].name;

					// mesh.castShadow = this.castShadow;
					// mesh.receiveShadow = this.receiveShadow;

					this.object3D.add(mesh);

				};

				if( onComplete instanceof Function ){

					onComplete.call(this, this.object3D);

				};

			};

			return this;

		},
		getObject3D: function( onComplete ){

			if( this.ready == true ){

				this.setObject3D(onComplete);

			}
			else {

				this.object3DNeedsUpdate = true;

				this.object3DComplete = onComplete;

			};

			return this.object3D;

		},
		setSimpleObject3D: function( onComplete ){

			if( this.datas != null && USE_THREE == true ){

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

				// mesh.castShadow = this.castShadow;
				// mesh.receiveShadow = this.receiveShadow;

				this.simpleObject3D.add(mesh);

				if( onComplete instanceof Function ){

					onComplete.call(this, this.simpleObject3D);

				};

			};

			return this;

		},
		getSimpleObject3D: function( onComplete ){

			if( this.ready == true ){

				this.setSimpleObject3D(onComplete);

			}
			else {

				this.simpleObject3DNeedsUpdate = true;

				this.simpleObject3DComplete = onComplete;

			};

			return this.simpleObject3D;

		},
		getPixels: function( image ){

			this.canvas.width = image.naturalWidth;
			this.canvas.height = image.naturalHeight;

			this.context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

			return this.context.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data;

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
			var r = (g > 0 ? 255 : 0);
			var b = Math.floor(value - (r * g));
			var a = (((r * g) + b) > 0 ? 255 : 0);

			return {
				r: r,
				g: g,
				b: b,
				a: a
			};

		}
	};

	OBJImg.fn.init.prototype = OBJImg.fn;

	Object.defineProperty(OBJImg, "dictionary", {
		configurable: false,
		writable: false,
		enumerable: true,
		value: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.-0123456789/"
	});

	Object.defineProperty(OBJImg, "constants", {
		configurable: false,
		writable: false,
		enumerable: true,
		value: {
			shading: {
				flat: 0,
				smooth: 1
			},
			wrapping: {
				clamp: 0
			},
			channel: {
				rgb: 0,
				r: 1,
				g: 2,
				b: 3
			},
			side: {
				front: 0,
				back: 1,
				double: 2
			}
		}
	});

	Object.defineProperty(OBJImg, "convertIMG", {
		configurable: false,
		writable: false,
		enumerable: true,
		value: function( pixels ){

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
				var smooth = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var ambientColor = OBJImg.fn.getPixelColor(pixelIndex++, pixels);
				var ambientMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var ambientClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var ambientChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var ambientMap = null;

				if( ambientMapCharacters > 0 ){

					ambientMap = "";

					for( var character = 0; character < ambientMapCharacters; character++ ){

						ambientMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var diffuseColor = OBJImg.fn.getPixelColor(pixelIndex++, pixels);
				var diffuseMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var diffuseClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var diffuseChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var diffuseMap = null;

				if( diffuseMapCharacters > 0 ){

					diffuseMap = "";

					for( var character = 0; character < diffuseMapCharacters; character++ ){

						diffuseMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var specularColor = OBJImg.fn.getPixelColor(pixelIndex++, pixels);
				var specularMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var specularClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var specularChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var specularMap = null;

				if( specularMapCharacters > 0 ){

					specularMap = "";

					for( var character = 0; character < specularMapCharacters; character++ ){

						specularMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var specularForceMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var specularForceClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var specularForceChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var specularForceMap = null;

				if( specularForceMapCharacters > 0 ){

					specularForceMap = "";

					for( var character = 0; character < specularForceMapCharacters; character++ ){

						specularForceMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var specularForce = OBJImg.fn.getPixelValue(pixelIndex++, pixels) / (MAX / 1000);

				var normalMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var normalClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var normalChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var normalMap = null;

				if( normalMapCharacters > 0 ){

					normalMap = "";

					for( var character = 0; character < normalMapCharacters; character++ ){

						normalMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var bumpMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var bumpClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var bumpChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var bumpMap = null;

				if( bumpMapCharacters > 0 ){

					bumpMap = "";

					for( var character = 0; character < bumpMapCharacters; character++ ){

						bumpMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var environementMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var environementClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var environementChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var environementMap = null;

				if( environementMapCharacters > 0 ){

					environementMap = "";

					for( var character = 0; character < environementMapCharacters; character++ ){

						environementMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var reflectivity = OBJImg.fn.getPixelValue(pixelIndex++, pixels) / MAX;

				var opacity = OBJImg.fn.getPixelValue(pixelIndex++, pixels) / 255;
				var opacityMapCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var opacityClamp = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var opacityChannel = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var opacityTest = OBJImg.fn.getPixelValue(pixelIndex++, pixels) / 255;

				var opacityMap = null;

				if( opacityMapCharacters > 0 ){

					opacityMap = "";

					for( var character = 0; character < opacityMapCharacters; character++ ){

						opacityMap += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

					};

				};

				var shaderSide = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var depthTest = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);
				var depthWrite = (OBJImg.fn.getPixelValue(pixelIndex++, pixels) == 1 ? true : false);

				var vertexShaderCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var vertexShader = "";

				for( var character = 0; character < vertexShaderCharacters; character++ ){

					vertexShader += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

				};

				var fragmentShaderCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);
				var fragmentShader = "";

				for( var character = 0; character < fragmentShaderCharacters; character++ ){

					fragmentShader += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

				};

				materials[material] = {
					illumination: illumination,
					smooth: smooth,
					ambient: {
						map: ambientMap,
						clamp: ambientClamp,
						channel: ambientChannel || OBJImg.constants.channel.rgb,
						r: ambientColor.r / 255,
						g: ambientColor.g / 255,
						b: ambientColor.b / 255
					},
					diffuse: {
						map: diffuseMap,
						clamp: diffuseClamp,
						channel: diffuseChannel || OBJImg.constants.channel.rgb,
						r: diffuseColor.r / 255,
						g: diffuseColor.g / 255,
						b: diffuseColor.b / 255
					},
					specular: {
						map: specularMap,
						clamp: specularClamp,
						channel: specularChannel || OBJImg.constants.channel.rgb,
						forceMap: specularForceMap,
						forceClamp: specularForceClamp,
						forceChannel: specularForceChannel || OBJImg.constants.channel.rgb,
						force: specularForce,
						r: specularColor.r / 255,
						g: specularColor.g / 255,
						b: specularColor.b / 255
					},
					normal: {
						map: normalMap,
						clamp: normalClamp,
						channel: normalChannel || OBJImg.constants.channel.rgb
					},
					bump: {
						map: bumpMap,
						clamp: bumpClamp,
						channel: bumpChannel || OBJImg.constants.channel.rgb
					},
					environement: {
						map: environementMap,
						clamp: environementClamp,
						channel: environementChannel || OBJImg.constants.channel.rgb,
						reflectivity: reflectivity
					},
					opacity: {
						map: opacityMap,
						clamp: opacityClamp,
						channel: opacityChannel || OBJImg.constants.channel.rgb,
						value: opacity,
						test: opacityTest
					},
					shader: {
						side: shaderSide || OBJImg.constants.side.front,
						depthTest: depthTest,
						depthWrite: depthWrite,
						vertex: vertexShader || null,
						fragment: fragmentShader || null
					}
				};

			};

			var vertexMultiplicator = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

			var normalMultiplicator = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

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

				var objectNameCharacters = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				var objectName = "";

				for( var character = 0; character < objectNameCharacters; character++ ){

					objectName += OBJImg.dictionary[OBJImg.fn.getPixelValue(pixelIndex++, pixels)];

				};

				var useMaterial = (OBJImg.fn.getPixelColor(pixelIndex, pixels).a == 0 ? false : true);
				var materialID = OBJImg.fn.getPixelValue(pixelIndex++, pixels);

				objects[object] = {
					name: objectName,
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

				var x = (OBJImg.fn.getPixelValue(pixelIndex, pixels) / normalMultiplicator) - 1;
				var y = (OBJImg.fn.getPixelValue(pixelIndex + 1, pixels) / normalMultiplicator) - 1;
				var z = (OBJImg.fn.getPixelValue(pixelIndex + 2, pixels) / normalMultiplicator) - 1;

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

		}
	});

	Object.defineProperty(OBJImg, "generateIMG", {
		configurable: false,
		writable: false,
		enumerable: true,
		value: function( options ){

			var isURL = !/[\n\s]/.test(options.obj);

			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");

			if( options.useWorker == true ){

				var worker = new Worker(WORKER_URL);

				worker.addEventListener("message", function( event ){

					if( event.data.action == "convertOBJ" ){

						var pixels = event.data.content;
						var square = Math.ceil(Math.sqrt(pixels.length / 4));

						var imageData = context.createImageData(square, square);
						imageData.data.set(pixels);

						canvas.width = canvas.height = square;

						context.putImageData(imageData, 0, 0);

						if( options.onComplete instanceof Function ){

							options.onComplete(canvas.toDataURL("image/png", 1.0));

						};

					};

				}, false);

				worker.addEventListener("error", function( event ){

					console.error("worker error");

				}, false);

			};

			if( isURL == true ){

				new FileLoader(options.obj, function( data ){

					var obj = data;

					var mtlFile = (options.mtl || (obj.match(/(?:\n|^)\s*mtllib\s([^\n\r]+)/) || [])[1]);

					if( mtlFile != undefined ){

						new FileLoader(options.obj.split("/").slice(0, -1).join("/") + "/" + mtlFile, function( data ){

							var mtl = data;

							if( options.useWorker == true ){

								worker.postMessage({
									action: "convertOBJ",
									content: [obj, mtl]
								});

							}
							else {

								var pixels = OBJImg.convertOBJ(obj, mtl);
								var square = Math.ceil(Math.sqrt(pixels.length / 4));

								var imageData = context.createImageData(square, square);
								imageData.data.set(pixels);

								canvas.width = canvas.height = square;

								context.putImageData(imageData, 0, 0);

								if( options.onComplete instanceof Function ){

									options.onComplete(canvas.toDataURL("image/png", 1.0));

								};

							};

						}, function( error ){

							console.error("Cant load mtl (error " + error + ")");

						});

					}
					else {

						if( options.useWorker == true ){

							worker.postMessage({
								action: "convertOBJ",
								content: [obj, ""]
							});

						}
						else {

							var pixels = OBJImg.convertOBJ(obj, "");
							var square = Math.ceil(Math.sqrt(pixels.length / 4));

							var imageData = context.createImageData(square, square);
							imageData.data.set(pixels);

							canvas.width = canvas.height = square;

							context.putImageData(imageData, 0, 0);

							if( options.onComplete instanceof Function ){

								options.onComplete(canvas.toDataURL("image/png", 1.0));

							};

						};

					};

				}, function( error ){

					console.error("Cant load obj (error " + error + ")");

				});

			}
			else {

				var obj = options.obj || "";
				var mtl = options.mtl || "";

				if( options.useWorker == true ){

					worker.postMessage({
						action: "convertOBJ",
						content: [obj, mtl]
					});

				}
				else {

					var pixels = OBJImg.convertOBJ(obj, mtl);
					var square = Math.ceil(Math.sqrt(pixels.length / 4));

					var imageData = context.createImageData(square, square);
					imageData.data.set(pixels);

					canvas.width = canvas.height = square;

					context.putImageData(imageData, 0, 0);

					if( options.onComplete instanceof Function ){

						options.onComplete(canvas.toDataURL("image/png", 1.0));

					};

				};

			};

			return this;

		}
	});

	Object.defineProperty(OBJImg, "convertOBJ", {
		configurable: false,
		writable: false,
		enumerable: true,
		value: function( obj, mtl ){

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
							channel: OBJImg.constants.channel.rgb,
							r: 1.0,
							g: 1.0,
							b: 1.0
						},
						diffuse: {
							map: [],
							clamp: false,
							channel: OBJImg.constants.channel.rgb,
							r: 1.0,
							g: 1.0,
							b: 1.0
						},
						specular: {
							map: [],
							clamp: false,
							channel: OBJImg.constants.channel.rgb,
							forceMap: [],
							forceClamp: false,
							forceChannel: OBJImg.constants.channel.rgb,
							force: 1.0,
							r: 1.0,
							g: 1.0,
							b: 1.0
						},
						normal: {
							map: [],
							clamp: false,
							channel: OBJImg.constants.channel.rgb
						},
						bump: {
							map: [],
							clamp: false,
							channel: OBJImg.constants.channel.rgb
						},
						environement: {
							map: [],
							clamp: false,
							channel: OBJImg.constants.channel.rgb,
							reflectivity: 0
						},
						opacity: {
							map: [],
							clamp: false,
							channel: OBJImg.constants.channel.rgb, 
							value: 1.0,
							test: 0
						},
						shader: {
							side: OBJImg.constants.side.front,
							depthTest: true,
							depthWrite: true,
							vertex: [],
							fragment: []
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
				else if( type == "ne" ){

					materials[index].environement.reflectivity = parseFloat(datas[1]);

				}
				else if( type == "illum" ){

					materials[index].illumination = parseInt(datas[1]);

				}
				else if( type == "s" ){

					materials[index].smooth = (datas[1] == "off" || parseInt(datas[1]) == 0 ? false : true);

				}
				else if( type == "tf" ){

					// filter transmission

				}
				else if( type == "ni" ){

					// Optical density (refraction)

				}
				else if( type.substr(0, 3) == "map" && datas.length > 1 ){

					var map = datas[datas.length - 1] || null;
					var encodedMap = new Array();

					if( map != null ){

						for( var character = 0, characterLength = map.length; character < characterLength; character++ ){

							encodedMap[character] = OBJImg.dictionary.indexOf(map[character]);

						};

					};

					var options = {
						clamp: true,
						channel: OBJImg.constants.channel.rgb,
						test: 0
					};

					for( var option = 1, optionLength = datas.length; option < optionLength; option++ ){

						var optionType = datas[option];

						if( optionType == "-clamp" ){

							var value = datas[++option];

							options.clamp = (datas[++option] != "off" ? true : false);

						}
						else if( optionType == "-imfchan" ){

							options.channel = OBJImg.constants.channel[datas[++option]];

						}
						else if( optionType == "-test" ){

							options.test = parseFloat(datas[++option]);

						};

					};

					if( type == "map_ka" ){

						materials[index].ambient.map = encodedMap;
						materials[index].ambient.clamp = options.clamp;
						materials[index].ambient.channel = options.channel;

					}
					else if( type == "map_kd" ){

						materials[index].diffuse.map = encodedMap;
						materials[index].diffuse.clamp = options.clamp;
						materials[index].diffuse.channel = options.channel;

					}
					else if( type == "map_ks" ){

						materials[index].specular.map = encodedMap;
						materials[index].specular.clamp = options.clamp;
						materials[index].specular.channel = options.channel;

					}
					else if( type == "map_ns" ){

						materials[index].specular.forceMap = encodedMap;
						materials[index].specular.forceClamp = options.clamp;
						materials[index].specular.channel = options.channel;

					}
					else if( type == "map_kn" ){

						materials[index].normal.map = encodedMap;
						materials[index].normal.clamp = options.clamp;
						materials[index].normal.channel = options.channel;

					}
					else if( type == "map_ke" ){

						materials[index].environement.map = encodedMap;
						materials[index].environement.clamp = options.clamp;
						materials[index].environement.channel = options.channel;

					}
					else if( type == "map_bump" ){

						materials[index].bump.map = encodedMap;
						materials[index].bump.clamp = options.clamp;
						materials[index].bump.channel = options.channel;

					}
					else if( type == "map_d" ){

						materials[index].opacity.map = encodedMap;
						materials[index].opacity.clamp = options.clamp;
						materials[index].opacity.channel = options.channel;
						materials[index].opacity.test = options.test;

					};

				}
				else if( type == "shader_s" ){

					materials[index].shader.side = OBJImg.constants.side[datas[1]];

				}
				else if( type == "shader_dt" ){

					materials[index].shader.depthTest = (datas[1] != "off" ? true : false);

				}
				else if( type == "shader_dw" ){

					materials[index].shader.depthWrite = (datas[1] != "off" ? true : false);

				}
				else if( type.substr(0, 6) == "shader" && datas.length > 1 ){

					var shader = datas[datas.length - 1] || null;
					var encodedShader = new Array();

					if( shader != null ){

						for( var character = 0, characterLength = shader.length; character < characterLength; character++ ){

							encodedShader[character] = OBJImg.dictionary.indexOf(shader[character]);

						};

					};

					if( type == "shader_v" ){

						materials[index].shader.vertex = encodedShader;

					}
					else if( type == "shader_f"  ){

						materials[index].shader.fragment = encodedShader;					

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
						x: 0,
						y: 0,
						z: 0,
						w: 0
					},
					max: {
						x: -0,
						y: -0,
						z: -0,
						w: -0
					}
				},
				normal: {
					min: {
						x: 0,
						y: 0,
						z: 0,
						w: 0
					},
					max: {
						x: -0,
						y: -0,
						z: -0,
						w: -0
					}
				},
				texture: {
					min: 0,
					max: -0
				}
			};

			for( var line = 0, length = OBJLines.length; line < length; line++ ){

				var datas = OBJLines[line].split(/\s+/g);
				var type = datas[0].toLowerCase();

				if( type == "v" ){

					var x = parseFloat(datas[1]);
					var y = parseFloat(datas[2]);
					var z = parseFloat(datas[3]);

					bounds.vertex.min.x = Math.min(x, bounds.vertex.min.x);
					bounds.vertex.max.x = Math.max(x, bounds.vertex.max.x);

					bounds.vertex.min.y = Math.min(y, bounds.vertex.min.y);
					bounds.vertex.max.y = Math.max(y, bounds.vertex.max.y);

					bounds.vertex.min.z = Math.min(z, bounds.vertex.min.z);
					bounds.vertex.max.z = Math.max(z, bounds.vertex.max.z);

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

					bounds.texture.min = Math.min(min, bounds.texture.min);
					bounds.texture.max = Math.max(max, bounds.texture.max);

					textures.push({
						u: u,
						v: v
					});

				}
				else if( type == "vn" ){

					var x = parseFloat(datas[1]);
					var y = parseFloat(datas[2]);
					var z = parseFloat(datas[3]);

					bounds.normal.min.x = Math.min(x, bounds.normal.min.x);
					bounds.normal.max.x = Math.max(x, bounds.normal.max.x);

					bounds.normal.min.y = Math.min(y, bounds.normal.min.y);
					bounds.normal.max.y = Math.max(y, bounds.normal.max.y);

					bounds.normal.min.z = Math.min(z, bounds.normal.min.z);
					bounds.normal.max.z = Math.max(z, bounds.normal.max.z);

					normals.push({
						x: x,
						y: y,
						z: z
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

					if( datas.length == 3 ){

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
					else {

						var d = datas[4].split(/\//g);

						var vd = parseInt(d[0]) - 1;
						var td = parseInt(d[1]) - 1;
						var nd = parseInt(d[2]) - 1;

						faces.push({
							vertices: {
								a: (!isNaN(va) ? va : null),
								b: (!isNaN(vb) ? vb : null),
								c: (!isNaN(vd) ? vd : null)
							},
							textures: {
								a: (!isNaN(ta) ? ta : null),
								b: (!isNaN(tb) ? tb : null),
								c: (!isNaN(td) ? td : null)
							},
							normals: {
								a: (!isNaN(na) ? na : null),
								b: (!isNaN(nb) ? nb : null),
								c: (!isNaN(nd) ? nd : null)
							}
						});

						faces.push({
							vertices: {
								a: (!isNaN(vb) ? vb : null),
								b: (!isNaN(vc) ? vc : null),
								c: (!isNaN(vd) ? vd : null)
							},
							textures: {
								a: (!isNaN(tb) ? tb : null),
								b: (!isNaN(tc) ? tc : null),
								c: (!isNaN(td) ? td : null)
							},
							normals: {
								a: (!isNaN(nb) ? nb : null),
								b: (!isNaN(nc) ? nc : null),
								c: (!isNaN(nd) ? nd : null)
							}
						});

					};

				}
				else if( type == "o" || type == "g" ){

					var nameMap = new Array();

					for( var character = 0, characterLength = datas[1].length; character < characterLength; character++ ){

						nameMap[character] = OBJImg.dictionary.indexOf(datas[1][character]);

					};

					objects.push({
						name: nameMap,
						material: null,
						index: faces.length
					});

				}
				else if( type == "usemtl" ){

					var materialID = materialsID.indexOf(datas[1]);

					if( materialID >= 0 ){

						objects[objects.length - 1].material = materialID

					};

				};

			};

			bounds.vertex.min.w = Math.min(bounds.vertex.min.x, bounds.vertex.min.y, bounds.vertex.min.z);
			bounds.vertex.max.w = Math.max(bounds.vertex.max.x, bounds.vertex.max.y, bounds.vertex.max.z);

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
				materials: 1 + (materials.length * 12 * 2),
				vertexMultiplicator: 1,
				textureMultiplicator: 1,
				textureOffset: 1,
				objects: 1 + (objects.length * faceSplitting),
				pivot: 3
			});

			var pixelCount = parameters 
				+ (vertices.length * XYZ)
				+ (textures.length * UV)
				+ (normals.length * XYZ)
				+ ((faces.length * ABC * vertexSplitting) + (faces.length * ABC * textureSplitting) + (faces.length * ABC * normalSplitting));

			for( var object = 0, length = objects.length; object < length; object++ ){

				pixelCount += 1 + objects[object].name.length;

			};

			for( var material = 0, length = materials.length; material < length; material++ ){

				pixelCount += 3 * RGB;
				pixelCount += 1 + materials[material].ambient.map.length;
				pixelCount += 1 + materials[material].diffuse.map.length;
				pixelCount += 1 + materials[material].specular.map.length;
				pixelCount += 1 + materials[material].specular.forceMap.length;
				pixelCount += 1 + materials[material].normal.map.length;
				pixelCount += 1 + materials[material].bump.map.length;
				pixelCount += 1 + materials[material].opacity.map.length;
				pixelCount += 1 + materials[material].environement.map.length;
				pixelCount += 1 + materials[material].shader.vertex.length;
				pixelCount += 1 + materials[material].shader.fragment.length;

			};

			var square = Math.ceil(Math.sqrt(pixelCount));

			var data = new Uint8ClampedArray(pixelCount * 4);

			var vertexSplittingColor = OBJImg.fn.getColorFromValue(vertexSplitting);
			data[pixelIndex++] = vertexSplittingColor.r;
			data[pixelIndex++] = vertexSplittingColor.g;
			data[pixelIndex++] = vertexSplittingColor.b;
			data[pixelIndex++] = vertexSplittingColor.a;

			var textureSplittingColor = OBJImg.fn.getColorFromValue(textureSplitting);
			data[pixelIndex++] = textureSplittingColor.r;
			data[pixelIndex++] = textureSplittingColor.g;
			data[pixelIndex++] = textureSplittingColor.b;
			data[pixelIndex++] = textureSplittingColor.a;

			var normalSplittingColor = OBJImg.fn.getColorFromValue(normalSplitting);
			data[pixelIndex++] = normalSplittingColor.r;
			data[pixelIndex++] = normalSplittingColor.g;
			data[pixelIndex++] = normalSplittingColor.b;
			data[pixelIndex++] = normalSplittingColor.a;

			var faceSplittingColor = OBJImg.fn.getColorFromValue(faceSplitting);
			data[pixelIndex++] = faceSplittingColor.r;
			data[pixelIndex++] = faceSplittingColor.g;
			data[pixelIndex++] = faceSplittingColor.b;
			data[pixelIndex++] = faceSplittingColor.a;

			var vertexPass = 0;

			for( var pass = 0; pass < vertexSplitting; pass++ ){

				var vertexIndex = Math.min(vertices.length - vertexPass, MAX);
				var vertexColor = OBJImg.fn.getColorFromValue(vertexIndex);

				data[pixelIndex++] = vertexColor.r;
				data[pixelIndex++] = vertexColor.g;
				data[pixelIndex++] = vertexColor.b;
				data[pixelIndex++] = vertexColor.a;

				vertexPass += vertexIndex;

			};

			var texturePass = 0;

			for( var pass = 0; pass < textureSplitting; pass++ ){

				var textureIndex = Math.min(textures.length - texturePass, MAX);
				var textureColor = OBJImg.fn.getColorFromValue(textureIndex);

				data[pixelIndex++] = textureColor.r;
				data[pixelIndex++] = textureColor.g;
				data[pixelIndex++] = textureColor.b;
				data[pixelIndex++] = textureColor.a;

				texturePass += textureIndex;

			};

			var normalPass = 0;

			for( var pass = 0; pass < normalSplitting; pass++ ){

				var normalIndex = Math.min(normals.length - normalPass, MAX);
				var normalColor = OBJImg.fn.getColorFromValue(normalIndex);

				data[pixelIndex++] = normalColor.r;
				data[pixelIndex++] = normalColor.g;
				data[pixelIndex++] = normalColor.b;
				data[pixelIndex++] = normalColor.a;

				normalPass += normalIndex;

			};

			var facePass = 0;

			for( var pass = 0; pass < faceSplitting; pass++ ){

				var faceIndex = Math.min(faces.length - facePass, MAX);
				var faceColor = OBJImg.fn.getColorFromValue(faceIndex);

				data[pixelIndex++] = faceColor.r;
				data[pixelIndex++] = faceColor.g;
				data[pixelIndex++] = faceColor.b;
				data[pixelIndex++] = faceColor.a;

				facePass += faceIndex;

			};

			var materialColor = OBJImg.fn.getColorFromValue(materials.length);

			data[pixelIndex++] = materialColor.r;
			data[pixelIndex++] = materialColor.g;
			data[pixelIndex++] = materialColor.b;
			data[pixelIndex++] = materialColor.a;

			for( var material = 0, length = materials.length; material < length; material++ ){

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].illumination;
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].smooth == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = Math.round(materials[material].ambient.r * 255);
				data[pixelIndex++] = Math.round(materials[material].ambient.g * 255);
				data[pixelIndex++] = Math.round(materials[material].ambient.b * 255);
				data[pixelIndex++] = 255;

				var ambientMapCharactersColor = OBJImg.fn.getColorFromValue(materials[material].ambient.map.length);

				data[pixelIndex++] = ambientMapCharactersColor.r;
				data[pixelIndex++] = ambientMapCharactersColor.g;
				data[pixelIndex++] = ambientMapCharactersColor.b;
				data[pixelIndex++] = ambientMapCharactersColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].ambient.clamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].ambient.channel;
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].ambient.map.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].ambient.map[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				data[pixelIndex++] = Math.round(materials[material].diffuse.r * 255);
				data[pixelIndex++] = Math.round(materials[material].diffuse.g * 255);
				data[pixelIndex++] = Math.round(materials[material].diffuse.b * 255);
				data[pixelIndex++] = 255;

				var diffuseMapCharactersColor = OBJImg.fn.getColorFromValue(materials[material].diffuse.map.length);

				data[pixelIndex++] = diffuseMapCharactersColor.r;
				data[pixelIndex++] = diffuseMapCharactersColor.g;
				data[pixelIndex++] = diffuseMapCharactersColor.b;
				data[pixelIndex++] = diffuseMapCharactersColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].diffuse.clamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].diffuse.channel;
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].diffuse.map.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].diffuse.map[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				data[pixelIndex++] = Math.round(materials[material].specular.r * 255);
				data[pixelIndex++] = Math.round(materials[material].specular.g * 255);
				data[pixelIndex++] = Math.round(materials[material].specular.b * 255);
				data[pixelIndex++] = 255;

				var specularMapCharactersColor = OBJImg.fn.getColorFromValue(materials[material].specular.map.length);

				data[pixelIndex++] = specularMapCharactersColor.r;
				data[pixelIndex++] = specularMapCharactersColor.g;
				data[pixelIndex++] = specularMapCharactersColor.b;
				data[pixelIndex++] = specularMapCharactersColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].specular.clamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].specular.channel;
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].specular.map.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].specular.map[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				var specularForceMapCharactersColor =  OBJImg.fn.getColorFromValue(materials[material].specular.forceMap.length);

				data[pixelIndex++] = specularForceMapCharactersColor.r;
				data[pixelIndex++] = specularForceMapCharactersColor.g;
				data[pixelIndex++] = specularForceMapCharactersColor.b;
				data[pixelIndex++] = specularForceMapCharactersColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].specular.forceClamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].specular.forceChannel;
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].specular.forceMap.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].specular.forceMap[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				var specularForceColor = OBJImg.fn.getColorFromValue(materials[material].specular.force * (MAX / 1000));

				data[pixelIndex++] = specularForceColor.r;
				data[pixelIndex++] = specularForceColor.g;
				data[pixelIndex++] = specularForceColor.b;
				data[pixelIndex++] = specularForceColor.a;

				var normalMapCharactersColor = OBJImg.fn.getColorFromValue(materials[material].normal.map.length);

				data[pixelIndex++] = normalMapCharactersColor.r;
				data[pixelIndex++] = normalMapCharactersColor.g;
				data[pixelIndex++] = normalMapCharactersColor.b;
				data[pixelIndex++] = normalMapCharactersColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].normal.clamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].normal.channel;
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].normal.map.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].normal.map[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				var bumpMapCharacters = OBJImg.fn.getColorFromValue(materials[material].bump.map.length);

				data[pixelIndex++] = bumpMapCharacters.r;
				data[pixelIndex++] = bumpMapCharacters.g;
				data[pixelIndex++] = bumpMapCharacters.b;
				data[pixelIndex++] = bumpMapCharacters.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].bump.clamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].bump.channel;
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].bump.map.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].bump.map[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				var environementMapCharactersColor = OBJImg.fn.getColorFromValue(materials[material].environement.map.length);

				data[pixelIndex++] = environementMapCharactersColor.r;
				data[pixelIndex++] = environementMapCharactersColor.g;
				data[pixelIndex++] = environementMapCharactersColor.b;
				data[pixelIndex++] = environementMapCharactersColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].environement.clamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].environement.channel;
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].environement.map.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].environement.map[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				var reflectivityColor = OBJImg.fn.getColorFromValue(materials[material].environement.reflectivity * MAX);

				data[pixelIndex++] = reflectivityColor.r;
				data[pixelIndex++] = reflectivityColor.g;
				data[pixelIndex++] = reflectivityColor.b;
				data[pixelIndex++] = reflectivityColor.a;

				var opacityColor = OBJImg.fn.getColorFromValue(materials[material].opacity.value * 255);

				data[pixelIndex++] = opacityColor.r;
				data[pixelIndex++] = opacityColor.g;
				data[pixelIndex++] = opacityColor.b;
				data[pixelIndex++] = opacityColor.a;

				var opacityMapCharactersColor =  OBJImg.fn.getColorFromValue(materials[material].opacity.map.length);

				data[pixelIndex++] = opacityMapCharactersColor.r;
				data[pixelIndex++] = opacityMapCharactersColor.g;
				data[pixelIndex++] = opacityMapCharactersColor.b;
				data[pixelIndex++] = opacityMapCharactersColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].opacity.clamp == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = materials[material].opacity.channel;
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = Math.round(materials[material].opacity.test * 255);
				data[pixelIndex++] = 255;

				for( var character = 0, characterLength = materials[material].opacity.map.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].opacity.map[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				var shaderSideColor = OBJImg.fn.getColorFromValue(materials[material].shader.side);

				data[pixelIndex++] = shaderSideColor.r;
				data[pixelIndex++] = shaderSideColor.g;
				data[pixelIndex++] = shaderSideColor.b;
				data[pixelIndex++] = shaderSideColor.a;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].shader.depthTest == true ? 1 : 0);
				data[pixelIndex++] = 255;

				data[pixelIndex++] = 0;
				data[pixelIndex++] = 0;
				data[pixelIndex++] = (materials[material].shader.depthWrite == true ? 1 : 0);
				data[pixelIndex++] = 255;

				var vertexShaderCharactersColor = OBJImg.fn.getColorFromValue(materials[material].shader.vertex.length);

				data[pixelIndex++] = vertexShaderCharactersColor.r;
				data[pixelIndex++] = vertexShaderCharactersColor.g;
				data[pixelIndex++] = vertexShaderCharactersColor.b;
				data[pixelIndex++] = vertexShaderCharactersColor.a;

				for( var character = 0, characterLength = materials[material].shader.vertex.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].shader.vertex[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				var fragmentShaderCharactersColor = OBJImg.fn.getColorFromValue(materials[material].shader.fragment.length);

				data[pixelIndex++] = fragmentShaderCharactersColor.r;
				data[pixelIndex++] = fragmentShaderCharactersColor.g;
				data[pixelIndex++] = fragmentShaderCharactersColor.b;
				data[pixelIndex++] = fragmentShaderCharactersColor.a;

				for( var character = 0, characterLength = materials[material].shader.fragment.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(materials[material].shader.fragment[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

			};

			var vertexMultiplicatorColor = OBJImg.fn.getColorFromValue(MAX / Math.max((bounds.vertex.max.w + Math.abs(Math.min(bounds.vertex.min.x, bounds.vertex.min.y, bounds.vertex.min.z, bounds.vertex.min.w))), 1));
			var vertexMultiplicator = vertexMultiplicatorColor.r * vertexMultiplicatorColor.g + vertexMultiplicatorColor.b;

			data[pixelIndex++] = vertexMultiplicatorColor.r;
			data[pixelIndex++] = vertexMultiplicatorColor.g;
			data[pixelIndex++] = vertexMultiplicatorColor.b;
			data[pixelIndex++] = vertexMultiplicatorColor.a;

			var normalMultiplicatorColor = OBJImg.fn.getColorFromValue(MAX / Math.max((bounds.normal.max.w + Math.abs(Math.min(bounds.normal.min.x, bounds.normal.min.y, bounds.normal.min.z, bounds.normal.min.w))) + 1, 1));
			var normalMultiplicator = normalMultiplicatorColor.r * normalMultiplicatorColor.g + normalMultiplicatorColor.b;

			data[pixelIndex++] = normalMultiplicatorColor.r;
			data[pixelIndex++] = normalMultiplicatorColor.g;
			data[pixelIndex++] = normalMultiplicatorColor.b;
			data[pixelIndex++] = normalMultiplicatorColor.a;

			if( textureSplitting > 0 ){

				var textureMultiplicatorColor = OBJImg.fn.getColorFromValue(MAX / Math.max((bounds.texture.max + Math.abs(bounds.texture.min)), 1));
				var textureMultiplicator = textureMultiplicatorColor.r * textureMultiplicatorColor.g + textureMultiplicatorColor.b;

				data[pixelIndex++] = textureMultiplicatorColor.r;
				data[pixelIndex++] = textureMultiplicatorColor.g;
				data[pixelIndex++] = textureMultiplicatorColor.b;
				data[pixelIndex++] = textureMultiplicatorColor.a;

				var textureOffsetColor = OBJImg.fn.getColorFromValue(Math.abs(bounds.texture.min) * textureMultiplicator);

				data[pixelIndex++] = textureOffsetColor.r;
				data[pixelIndex++] = textureOffsetColor.g;
				data[pixelIndex++] = textureOffsetColor.b;
				data[pixelIndex++] = textureOffsetColor.a;

			};

			var objectsColor = OBJImg.fn.getColorFromValue(objects.length);

			data[pixelIndex++] = objectsColor.r;
			data[pixelIndex++] = objectsColor.g;
			data[pixelIndex++] = objectsColor.b;
			data[pixelIndex++] = objectsColor.a;

			for( var object = 0, length = objects.length; object < length; object++ ){

				var objectPass = 0;

				for( var pass = 0; pass < faceSplitting; pass++ ){

					var objectIndex = Math.min(objects[object].index - objectPass, MAX);
					var objectColor = OBJImg.fn.getColorFromValue(objectIndex);

					data[pixelIndex++] = objectColor.r;
					data[pixelIndex++] = objectColor.g;
					data[pixelIndex++] = objectColor.b;
					data[pixelIndex++] = objectColor.a;

					objectPass += objectIndex;

				};

				var objectNameCharactersColor = OBJImg.fn.getColorFromValue(objects[object].name.length);

				data[pixelIndex++] = objectNameCharactersColor.r;
				data[pixelIndex++] = objectNameCharactersColor.g;
				data[pixelIndex++] = objectNameCharactersColor.b;
				data[pixelIndex++] = objectNameCharactersColor.a;

				for( var character = 0, characterLength = objects[object].name.length; character < characterLength; character++ ){

					var characterColor = OBJImg.fn.getColorFromValue(objects[object].name[character]);

					data[pixelIndex++] = characterColor.r;
					data[pixelIndex++] = characterColor.g;
					data[pixelIndex++] = characterColor.b;
					data[pixelIndex++] = characterColor.a;

				};

				if( objects[object].material != null ){

					var materialColor = OBJImg.fn.getColorFromValue(objects[object].material);

					data[pixelIndex++] = materialColor.r;
					data[pixelIndex++] = materialColor.g;
					data[pixelIndex++] = materialColor.b;
					data[pixelIndex++] = 255;

				}
				else {

					data[pixelIndex++] = 0;
					data[pixelIndex++] = 0;
					data[pixelIndex++] = 0;
					data[pixelIndex++] = 0;

				};

			};

			var pivot = {
				x: Math.abs(bounds.vertex.min.x) * vertexMultiplicator,
				y: Math.abs(bounds.vertex.min.y) * vertexMultiplicator,
				z: Math.abs(bounds.vertex.min.z) * vertexMultiplicator
			};

			var pivotXColor = OBJImg.fn.getColorFromValue(pivot.x);

			data[pixelIndex++] = pivotXColor.r;
			data[pixelIndex++] = pivotXColor.g;
			data[pixelIndex++] = pivotXColor.b;
			data[pixelIndex++] = pivotXColor.a;

			var pivotYColor = OBJImg.fn.getColorFromValue(pivot.y);

			data[pixelIndex++] = pivotYColor.r;
			data[pixelIndex++] = pivotYColor.g;
			data[pixelIndex++] = pivotYColor.b;
			data[pixelIndex++] = pivotYColor.a;

			var pivotZColor = OBJImg.fn.getColorFromValue(pivot.z);

			data[pixelIndex++] = pivotZColor.r;
			data[pixelIndex++] = pivotZColor.g;
			data[pixelIndex++] = pivotZColor.b;
			data[pixelIndex++] = pivotZColor.a;

			for( var vertex = 0, length = vertices.length; vertex < length; vertex++ ){

				var xColor = OBJImg.fn.getColorFromValue((vertices[vertex].x + Math.abs(bounds.vertex.min.x)) * vertexMultiplicator);

				data[pixelIndex++] = xColor.r;
				data[pixelIndex++] = xColor.g;
				data[pixelIndex++] = xColor.b;
				data[pixelIndex++] = xColor.a;

				var yColor = OBJImg.fn.getColorFromValue((vertices[vertex].y + Math.abs(bounds.vertex.min.y)) * vertexMultiplicator);

				data[pixelIndex++] = yColor.r;
				data[pixelIndex++] = yColor.g;
				data[pixelIndex++] = yColor.b;
				data[pixelIndex++] = yColor.a;

				var zColor = OBJImg.fn.getColorFromValue((vertices[vertex].z + Math.abs(bounds.vertex.min.z)) * vertexMultiplicator);

				data[pixelIndex++] = zColor.r;
				data[pixelIndex++] = zColor.g;
				data[pixelIndex++] = zColor.b;
				data[pixelIndex++] = zColor.a;

			};

			for( var texture = 0, length = textures.length; texture < length; texture++ ){

				var uColor = OBJImg.fn.getColorFromValue((textures[texture].u + Math.abs(bounds.texture.min)) * textureMultiplicator);

				data[pixelIndex++] = uColor.r;
				data[pixelIndex++] = uColor.g;
				data[pixelIndex++] = uColor.b;
				data[pixelIndex++] = uColor.a;

				var vColor = OBJImg.fn.getColorFromValue((textures[texture].v + Math.abs(bounds.texture.min)) * textureMultiplicator);

				data[pixelIndex++] = vColor.r;
				data[pixelIndex++] = vColor.g;
				data[pixelIndex++] = vColor.b;
				data[pixelIndex++] = vColor.a;

			};

			for( var normal = 0, length = normals.length; normal < length; normal++ ){

				var xColor = OBJImg.fn.getColorFromValue((normals[normal].x + 1) * normalMultiplicator);

				data[pixelIndex++] = xColor.r;
				data[pixelIndex++] = xColor.g;
				data[pixelIndex++] = xColor.b;
				data[pixelIndex++] = xColor.a;

				var yColor = OBJImg.fn.getColorFromValue((normals[normal].y + 1) * normalMultiplicator);

				data[pixelIndex++] = yColor.r;
				data[pixelIndex++] = yColor.g;
				data[pixelIndex++] = yColor.b;
				data[pixelIndex++] = yColor.a;

				var zColor = OBJImg.fn.getColorFromValue((normals[normal].z + 1) * normalMultiplicator);

				data[pixelIndex++] = zColor.r;
				data[pixelIndex++] = zColor.g;
				data[pixelIndex++] = zColor.b;
				data[pixelIndex++] = zColor.a;

			};

			for( var face = 0, length = faces.length; face < length; face++ ){

				var previousPass = 0;

				for( var pass = 0; pass < vertexSplitting; pass++ ){

					var vaIndex = Math.min(faces[face].vertices.a - previousPass, MAX);
					var vaColor = OBJImg.fn.getColorFromValue(vaIndex);

					data[pixelIndex++] = vaColor.r;
					data[pixelIndex++] = vaColor.g;
					data[pixelIndex++] = vaColor.b;
					data[pixelIndex++] = vaColor.a;

					previousPass += vaIndex;

				};

				previousPass = 0;

				for( var pass = 0; pass < vertexSplitting; pass++ ){

					var vbIndex = Math.min(faces[face].vertices.b - previousPass, MAX);
					var vbColor = OBJImg.fn.getColorFromValue(vbIndex);

					data[pixelIndex++] = vbColor.r;
					data[pixelIndex++] = vbColor.g;
					data[pixelIndex++] = vbColor.b;
					data[pixelIndex++] = vbColor.a;

					previousPass += vbIndex;

				};

				previousPass = 0;

				for( var pass = 0; pass < vertexSplitting; pass++ ){

					var vcIndex = Math.min(faces[face].vertices.c - previousPass, MAX);
					var vcColor = OBJImg.fn.getColorFromValue(vcIndex);

					data[pixelIndex++] = vcColor.r;
					data[pixelIndex++] = vcColor.g;
					data[pixelIndex++] = vcColor.b;
					data[pixelIndex++] = vcColor.a;

					previousPass += vcIndex;

				};

				previousPass = 0; 

				for( var pass = 0; pass < textureSplitting; pass++ ){

					var taIndex = Math.min(faces[face].textures.a - previousPass, MAX);
					var taColor = OBJImg.fn.getColorFromValue(taIndex);

					data[pixelIndex++] = taColor.r;
					data[pixelIndex++] = taColor.g;
					data[pixelIndex++] = taColor.b;
					data[pixelIndex++] = taColor.a;

					previousPass += taIndex;

				};

				previousPass = 0;

				for( var pass = 0; pass < textureSplitting; pass++ ){

					var tbIndex = Math.min(faces[face].textures.b - previousPass, MAX);
					var tbColor = OBJImg.fn.getColorFromValue(tbIndex);

					data[pixelIndex++] = tbColor.r;
					data[pixelIndex++] = tbColor.g;
					data[pixelIndex++] = tbColor.b;
					data[pixelIndex++] = tbColor.a;

					previousPass += tbIndex;

				};

				previousPass = 0;

				for( var pass = 0; pass < textureSplitting; pass++ ){

					var tcIndex = Math.min(faces[face].textures.c - previousPass, MAX);
					var tcColor = OBJImg.fn.getColorFromValue(tcIndex);

					data[pixelIndex++] = tcColor.r;
					data[pixelIndex++] = tcColor.g;
					data[pixelIndex++] = tcColor.b;
					data[pixelIndex++] = tcColor.a;

					previousPass += tcIndex;

				};

				previousPass = 0;

				for( var pass = 0; pass < normalSplitting; pass++ ){

					var naIndex = Math.min(faces[face].normals.a - previousPass, MAX);
					var naColor = OBJImg.fn.getColorFromValue(naIndex);

					data[pixelIndex++] = naColor.r;
					data[pixelIndex++] = naColor.g;
					data[pixelIndex++] = naColor.b;
					data[pixelIndex++] = naColor.a;

					previousPass += naIndex;

				};

				previousPass = 0;

				for( var pass = 0; pass < normalSplitting; pass++ ){

					var nbIndex = Math.min(faces[face].normals.b - previousPass, MAX);
					var nbColor = OBJImg.fn.getColorFromValue(nbIndex);

					data[pixelIndex++] = nbColor.r;
					data[pixelIndex++] = nbColor.g;
					data[pixelIndex++] = nbColor.b;
					data[pixelIndex++] = nbColor.a;

					previousPass += nbIndex;

				};

				previousPass = 0;

				for( var pass = 0; pass < normalSplitting; pass++ ){

					var ncIndex = Math.min(faces[face].normals.c - previousPass, MAX);
					var ncColor = OBJImg.fn.getColorFromValue(ncIndex);

					data[pixelIndex++] = ncColor.r;
					data[pixelIndex++] = ncColor.g;
					data[pixelIndex++] = ncColor.b;
					data[pixelIndex++] = ncColor.a;

					previousPass += ncIndex;

				};

			};

			return data;

		}
	});

	var ImageParser = function( url, channel, callback ){

		return new ImageParser.fn.init(url, channel, callback);

	};

	ImageParser.fn = ImageParser.prototype = {
		constructor: ImageParser,
		init: function( url, channel, callback ){

			this.image = new Image();

			this.image.addEventListener("load", function( event ){

				if( channel == OBJImg.constants.channel.rgb ){

					callback(this.image);

				}
				else {

					var canvas = document.createElement("canvas");
					var context = canvas.getContext("2d");

					canvas.width = this.image.naturalWidth;
					canvas.height = this.image.naturalHeight;

					context.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight);

					this.imageData = context.getImageData(0, 0, this.image.naturalWidth, this.image.naturalHeight);

					if( channel == OBJImg.constants.channel.r ){

						this.isolateRed();

					}
					else if( channel == OBJImg.constants.channel.g ){

						this.isolateGreen();

					}
					else if( channel == OBJImg.constants.channel.b ){

						this.isolateBlue();

					};

					context.putImageData(this.imageData, 0, 0);

					this.image = new Image();
					this.image.src = canvas.toDataURL("image/png", 1.0);

					callback(this.image);

				};

			}.bind(this), false);

			this.image.src = url;

			return this;

		},
		isolateRed: function(){

			for( var pixel = 0, length = this.imageData.data.length; pixel < length; pixel += 4 ){

				this.imageData.data[pixel + 1] = this.imageData.data[pixel];
				this.imageData.data[pixel + 2] = this.imageData.data[pixel];

			};

			return this;

		},
		isolateGreen: function(){

			for( var pixel = 0, length = this.imageData.data.length; pixel < length; pixel += 4 ){

				this.imageData.data[pixel] = this.imageData.data[pixel + 1];
				this.imageData.data[pixel + 2] = this.imageData.data[pixel + 1];

			};

			return this;

		},
		isolateBlue: function(){

			for( var pixel = 0, length = this.imageData.data.length; pixel < length; pixel += 4 ){

				this.imageData.data[pixel] = this.imageData.data[pixel + 2];
				this.imageData.data[pixel + 1] = this.imageData.data[pixel + 2];

			};

			return this;

		}
	};

	ImageParser.fn.init.prototype = ImageParser.fn;

	var FileLoader = function( url, onComplete, onError ){

		return new FileLoader.fn.init(url, onComplete, onError);

	};

	FileLoader.fn = FileLoader.prototype = {
		constructor: FileLoader,
		init: function( url, onComplete, onError ){

			this.request = new XMLHttpRequest();

			this.request.addEventListener("readystatechange", function( event ){

				if( this.readyState == 4 ){

					if( this.status >= 200 && this.status < 400 ){

						onComplete(this.responseText);

					}
					else {

						if( onError instanceof Function ){

							onError(event.target.status);

						};

					};

				};

			}, false);

			this.request.open("GET", url, true);
			this.request.send(null);

			return this;

		}
	};

	FileLoader.fn.init.prototype = FileLoader.fn;

	if( typeof define !== "undefined" && define instanceof Function && define.amd != undefined ){

		define(function(){

			return OBJImg;

		});

	}
	else if( typeof module !== "undefined" && module.exports ){

		module.exports = OBJImg;

	}
	else if( self != undefined ){

		self.OBJImg = OBJImg;

	};

})(this || {});