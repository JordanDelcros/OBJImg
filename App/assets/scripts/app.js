(function( GUI, FileSystem, window, document ){

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

			this.super.showDevTools();

			this.restoreSession();

			this.setMenu();

			this.document.addEventListener("DOMContentLoaded", function( event ){

				this.setEvents();

			}.bind(this), false);

			this.super.show();

			return this;

		},
		setMenu: function(){

			var menu = new this.GUI.Menu({
				type: "menubar"
			});

			menu.createMacBuiltin(this.name, {
				hideEdit: true,
				hideWindow: true
			});

			var tools = new this.GUI.Menu();

			tools.append(new this.GUI.MenuItem({
				label: "custom 1"
			}));

			menu.append(new this.GUI.MenuItem({
				label: this.getText("tools"),
				submenu: tools
			}));

			// complete existing
			// menu.items[0].submenu.insert(new this.GUI.MenuItem({
			// 	label: "Préférences"
			// }), 2);

			this.super.menu = menu;

			return this;

		},
		setEvents: function(){

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

			this.window.addEventListener("dragover", function( event ){

				event.preventDefault();

				console.log("dragover", event);

			}, false);

			this.window.addEventListener("dragleave", function( event ){

				event.preventDefault();

				console.log("dragleave", event);

			}, false);

			this.window.addEventListener("drop", function( event ){

				event.preventDefault();

				console.log("drop", event);

			}, false);

			return this;

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
		getText: function( label ){

			return this.texts[label];

		}
	};

	App.fn.init.prototype = App.fn;

	new App(GUI, window, document);

})(require("nw.gui"), require("fs"), window, document);