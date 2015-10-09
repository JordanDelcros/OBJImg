(function( GUI, FileSystem, OBJImg, window, document ){

	"use strict";

	var App = function( GUI, window, document ){

		return new App.fn.init(GUI, window, document);

	};

	App.fn = App.prototype = {
		constructor: App,
		init: function( GUI, window, document ){

			this.GUI = GUI;
			this.super = GUI.Window.get();
			this.window = window;
			this.document = document;

			this.texts = JSON.parse(FileSystem.readFileSync("assets/datas/texts.json", "utf-8"))[this.window.navigator.language];

			this.name = this.GUI.App.manifest.name;

			this.setMenu();

			this.openDevelopersTools();

			this.restoreSession();

			this.document.addEventListener("DOMContentLoaded", function( event ){

				this.setView();

				this.setEvents();

				this.window.requestAnimationFrame(this.renderView.bind(this));

			}.bind(this), false);

			this.super.show();

			return this;

		},
		setMenu: function(){

			this.menu = {
				main: new this.GUI.Menu({
					type: "menubar"
				}),
				tools: {
					main: new this.GUI.Menu(),
					devTools: new this.GUI.MenuItem({
						label: this.getText(["open", "devTools"]),
						click: this.toggleDevelopersTools.bind(this)
					})
				}
			};

			this.menu.main.createMacBuiltin(this.name, {
				hideEdit: true,
				hideWindow: true
			});

			this.menu.tools.main.append(this.menu.tools.devTools);

			this.menu.main.append(new this.GUI.MenuItem({
				label: this.getText("tools"),
				submenu: this.menu.tools.main
			}));

			// complete existing
			// menu.items[0].submenu.insert(new this.GUI.MenuItem({
			// 	label: "Préférences"
			// }), 2);

			this.super.menu = this.menu.main;

			return this;

		},
		setView: function(){

			this.quitButton = this.document.querySelector("#quit");
			this.minimizeButton = this.document.querySelector("#minimize");
			this.fullscreenButton = this.document.querySelector("#fullscreen");

			this.canvas = this.document.querySelector("canvas");

			this.renderer = new THREE.WebGLRenderer({
				canvas: this.canvas,
				precision: "highp",
				antialias: true,
				alpha: true
			});

			this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);

			this.canvasAspect = this.canvas.offsetWidth / this.canvas.offsetHeight;

			this.camera = new THREE.PerspectiveCamera(75, this.canvasAspect, 0.1, 10000);

			this.camera.position.set(0, 0, 2);

			this.scene = new THREE.Scene();

			this.light = new THREE.PointLight(0xFFFFFF);
			this.light.position.set(10, 10, 10);
			this.scene.add(this.light);

			this.hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x001133, 1);
			this.scene.add(this.hemisphereLight);

			return this;

		},
		setEvents: function(){

			this.quitButton.addEventListener("click", function( event ){

				event.preventDefault();

				this.quit();

			}.bind(this), false);

			this.minimizeButton.addEventListener("click", function( event ){

				event.preventDefault();

				this.minimize();

			}.bind(this), false);

			this.fullscreenButton.addEventListener("click", function( event ){

				event.preventDefault();

				this.fullscreen();

			}.bind(this), false);

			this.window.onbeforeunload = function( event ){

				event.preventDefault();

				this.saveSession();

			}.bind(this);

			this.window.addEventListener("dragover", function( event ){

				event.preventDefault();

			}.bind(this), false);

			this.window.addEventListener("dragleave", function( event ){

				event.preventDefault();
				event.stopPropagation();

			}.bind(this), false);

			this.window.addEventListener("drop", function( event ){

				event.preventDefault();
				event.stopPropagation();

				this.dropFile(event);

			}.bind(this), false);

			this.window.addEventListener("resize", function( event ){

				this.canvas.style.width = this.canvas.style.height = "";

				var width = this.canvas.offsetWidth;
				var height = this.canvas.offsetHeight;

				if( this.geometry ){

					var objectWidth = Math.abs(this.geometry.boundingBox.min.x - this.geometry.boundingBox.max.x);
					var objectHeight = Math.abs(this.geometry.boundingBox.min.y - this.geometry.boundingBox.max.y);
					var objectWeight = Math.abs(this.geometry.boundingBox.min.y - this.geometry.boundingBox.max.y);

					var distance = Math.max(objectWidth, objectHeight, objectWeight) / 1.8 / Math.tan(Math.PI * this.camera.fov / 360);

					this.camera.position.z = distance;

				};

				this.renderer.setSize(width, height);
				this.camera.aspect = width / height;

				this.camera.updateProjectionMatrix();

			}.bind(this), false);

		},
		renderView: function( now ){

			this.window.requestAnimationFrame(this.renderView.bind(this));

			this.renderer.render(this.scene, this.camera);

		},
		dropFile: function( event ){

			var path = event.dataTransfer.files[0].path;

			var filePath = path.split(/\//g);
			var fileName = filePath[filePath.length - 1].split(/\./)[0];

			FileSystem.readFile(path, "utf-8", function( error, datas ){

				if( error ){

					throw error;

				};

				OBJImg.generateImg(datas, function( datas ){

					var image = new Image();
					image.src = datas;

					FileSystem.writeFile(filePath.splice(0, filePath.length - 1).join("/") + "/" + fileName + ".obj.png", datas.replace(/^data:image\/png;base64/, ""), "base64", function( error ){

						if( error ){

							console.error("Cant save PNG file.");

						};

					});

					this.displayObject(image);

				}.bind(this));

			}.bind(this));

		},
		displayObject: function( image ){

			this.scene.remove(this.mesh);

			this.geometry = new OBJImg(image).getGeometry();

			var center = new THREE.Vector3().addVectors(this.geometry.boundingBox.min, this.geometry.boundingBox.max).divideScalar(2);

			this.material = new THREE.MeshPhongMaterial({
				color: 0x222222,
				side: THREE.FrontSide,
				shading: THREE.SmoothShading
			});

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.mesh.position.set(-center.x, -center.y, -center.z);

			this.scene.add(this.mesh);

			var event = new Event("Event");
			event.initEvent("resize", false, false);

			this.window.dispatchEvent(event);

		},
		fullscreen: function(){

			this.super.toggleFullscreen();

		},
		minimize: function(){

			this.super.minimize();

		},
		quit: function(){

			this.saveSession();

			this.super.close();

			return this;

		},
		saveSession: function(){

			this.window.localStorage.setItem("session", JSON.stringify({
				position: {
					x: this.super.x,
					y: this.super.y
				}
			}));

			return this;

		},
		restoreSession: function(){

			if( this.window.localStorage.hasOwnProperty("session") ){

				var session = JSON.parse(this.window.localStorage.getItem("session"));

				this.super.moveTo(session.position.x, session.position.y);

			};

			return this;

		},
		toggleDevelopersTools: function(){

			if( this.super.isDevToolsOpen() == true ){

				this.closeDevelopersTools();

			}
			else {

				this.openDevelopersTools();

			};

		},
		openDevelopersTools: function(){

			this.super.showDevTools();

			this.menu.tools.devTools.label = this.getText(["close", "devTools"]);

		},
		closeDevelopersTools: function(){

			this.super.closeDevTools();

			this.menu.tools.devTools.label = this.getText(["open", "devTools"]);

		},
		getText: function( label ){

			if( typeof label == "string" ){

				label = [label];

			};

			var text = "";

			for( var entry = 0, length = label.length; entry < length; entry++ ){

				if( entry > 0 ){

					text += " ";

				};

				text += this.texts[label[entry]];

			};

			return text.charAt(0).toUpperCase() + text.slice(1);

		}
	};

	App.fn.init.prototype = App.fn;

	new App(GUI, window, document);

})(require("nw.gui"), require("fs"), OBJImg, window, document);
