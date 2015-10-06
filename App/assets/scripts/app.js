(function( hyper, window, document ){

	console.log(hyper);

	hyper.showDevTools();

	document.addEventListener("DOMContentLoaded", function( event ){

		var quitButton = document.querySelector("#quit");
		var minimizeButton = document.querySelector("#minimize");
		var fullscreenButton = document.querySelector("#fullscreen");

		quitButton.addEventListener("click", function( event ){

			event.preventDefault();

			hyper.close();

		}, false);

		minimizeButton.addEventListener("click", function( event ){

			event.preventDefault();

			hyper.minimize();

		}, false);

		fullscreenButton.addEventListener("click", function( event ){

			event.preventDefault();

			hyper.toggleFullscreen();

		}, false);

	}, false);

})((require("nw.gui").Window.get()), window, document);