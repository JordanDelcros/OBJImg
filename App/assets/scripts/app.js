(function( hyper, window, document ){

	console.log(hyper);

	hyper.showDevTools();

	document.addEventListener("DOMContentLoaded", function( event ){

		var quitButton = document.querySelector("#quit");

		quitButton.addEventListener("click", function( event ){

			event.preventDefault();

			hyper.close();

		}, false);

	}, false);

})((require("nw.gui").Window.get()), window, document);