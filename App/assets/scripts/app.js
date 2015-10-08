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

				this.setDOM();

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
		setDOM: function(){

			var quitButton = this.document.querySelector("#quit");
			var minimizeButton = this.document.querySelector("#minimize");
			var fullscreenButton = this.document.querySelector("#fullscreen");

			quitButton.addEventListener("click", function( event ){

				event.preventDefault();

				this.quit();

			}.bind(this), false);

			minimizeButton.addEventListener("click", function( event ){

				event.preventDefault();

				this.minimize();

			}.bind(this), false);

			fullscreenButton.addEventListener("click", function( event ){

				event.preventDefault();

				this.fullscreen();

			}.bind(this), false);

			this.window.onbeforeunload = function( event ){

				event.preventDefault();

				this.saveSession();

			}.bind(this);

			this.window.addEventListener("dragover", function( event ){

				event.preventDefault();

				// console.log("dragover", event);

			}.bind(this), false);

			this.window.addEventListener("dragleave", function( event ){

				event.preventDefault();
				event.stopPropagation();

				// console.log("dragleave", event);

			}.bind(this), false);

			this.window.addEventListener("drop", function( event ){

				event.preventDefault();
				event.stopPropagation();

				this.dropFile(event);

			}.bind(this), false);

			this.generatedImage = this.document.querySelector("#generated");

			return this;

		},
		dropFile: function( event ){

			var path = event.dataTransfer.files[0].path;

			// var fileInfo = path.split(/\//g);
			// var fileName = fileInfo[fileInfo.length - 1].split(/\./)[0];

			FileSystem.readFile(path, "utf-8", function( error, datas ){

				if( error ){

					throw error;

				};

				OBJImg.generateImg(datas, function( datas ){

					var image = new Image();
					image.src = datas;

					this.setGeneratedImage(image);

				}.bind(this));

			}.bind(this));

		},
		setGeneratedImage: function( image ){

			this.generatedImage.src = image.src;

			this.generatedImage.width = image.naturalWidth;
			this.generatedImage.height = image.naturalHeight;

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