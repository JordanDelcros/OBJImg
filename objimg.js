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

			var datas = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);

			var vertices = new Array();

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

			for( var pixel = 0, length = datas.data.length; pixel < length; pixel += 4 ){

				var red = datas.data[pixel];
				var green = datas.data[pixel + 1];
				var blue = datas.data[pixel + 2];
				var alpha = datas.data[pixel + 3];

				if( red < bounds.min.x ){

					bounds.min.x = red;

				}
				else if( red > bounds.max.x ){

					bounds.max.x = red;

				};

				if( green < bounds.min.y ){

					bounds.min.y = green;

				}
				else if( green > bounds.max.y ){

					bounds.max.y = green;

				};

				if( blue < bounds.min.z ){

					bounds.min.z = blue;

				}
				else if( blue > bounds.max.z ){

					bounds.max.z = blue;

				};

				vertices.push({
					x: red,
					y: green,
					z: blue
				});

			};

			var center = {
				x: bounds.min.x + ((bounds.max.x - bounds.min.x) / 2),
				y: bounds.min.y + ((bounds.max.y - bounds.min.y) / 2),
				z: bounds.min.z + ((bounds.max.z - bounds.min.z) / 2)
			};

			for( var vertex = 0, length = vertices.length; vertex < length; vertex++ ){

				vertices[vertex].x -= center.x;
				vertices[vertex].y -= center.y;
				vertices[vertex].z -= center.z;

			};

			return {
				vertices: vertices
			};

		}
	};

	OBJImg.fn.init.prototype = OBJImg.fn;

	window.OBJImg = OBJImg;

})(window, document);