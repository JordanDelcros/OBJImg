import { THREE } from "../OBJImage.js";

const TRIANGLE = 3;
const VERTEX = 3;
const TEXTURE = 2;

export default class MeshGenerator {
	constructor( modelLibrary ){

		return this.initialize(modelLibrary);

	}
	initialize( modelLibrary ){

		console.warn("MESH GENERATOR", modelLibrary);

		var materials = new Object();

		if( modelLibrary.materialLibrary != null ){

			var textureLoader = new THREE.TextureLoader();

			for( let material of modelLibrary.materialLibrary.materials ){

				console.log(material)

				materials[material.name] = new THREE.MeshPhongMaterial({
					color: new THREE.Color(material.red, material.green, material.blue),
					map: (material.diffuse.map != null ? textureLoader.load(material.diffuse.map) : null),
					shininess: material.specular.force,
					opacity: material.opacity.value,
					transparent: (material.opacity.value < 1 ? true : false)
				});

			};

		};

		var objects = new THREE.Object3D();

		for( let object of modelLibrary.objects ){

			let objectContainer = new THREE.Object3D();

			for( let group of object.groups ){

				let geometry = new THREE.BufferGeometry();

				let indices = new Uint32Array(group.faces.length * 3);

				for( let index = 0; index < indices.length; index++ ){

					indices[index] = index;

				};

				let positions = new Float32Array(group.faces.length * TRIANGLE * VERTEX);

				let normals = new Float32Array(group.faces.length * TRIANGLE * VERTEX);

				let uvs = new Float32Array(group.faces.length * TRIANGLE * TEXTURE);

				for( let faceIndex = 0, faceLength = group.faces.length; faceIndex < faceLength; faceIndex++ ){

					let face = modelLibrary.faces[group.faces[faceIndex]];

					let computedFaceVertexIndex = (faceIndex * TRIANGLE * VERTEX);
					let computedFaceTextureIndex = (faceIndex * TRIANGLE * TEXTURE);

					positions[computedFaceVertexIndex + 0] = modelLibrary.vertices[face.vertexA].x;
					positions[computedFaceVertexIndex + 1] = modelLibrary.vertices[face.vertexA].y;
					positions[computedFaceVertexIndex + 2] = modelLibrary.vertices[face.vertexA].z;

					positions[computedFaceVertexIndex + 3] = modelLibrary.vertices[face.vertexB].x;
					positions[computedFaceVertexIndex + 4] = modelLibrary.vertices[face.vertexB].y;
					positions[computedFaceVertexIndex + 5] = modelLibrary.vertices[face.vertexB].z;

					positions[computedFaceVertexIndex + 6] = modelLibrary.vertices[face.vertexC].x;
					positions[computedFaceVertexIndex + 7] = modelLibrary.vertices[face.vertexC].y;
					positions[computedFaceVertexIndex + 8] = modelLibrary.vertices[face.vertexC].z;

					if( face.normalA != null && face.normalB != null && face.normalC != null ){

						normals[computedFaceVertexIndex + 0] = modelLibrary.normals[face.normalA].x;
						normals[computedFaceVertexIndex + 1] = modelLibrary.normals[face.normalA].y;
						normals[computedFaceVertexIndex + 2] = modelLibrary.normals[face.normalA].z;

						normals[computedFaceVertexIndex + 3] = modelLibrary.normals[face.normalB].x;
						normals[computedFaceVertexIndex + 4] = modelLibrary.normals[face.normalB].y;
						normals[computedFaceVertexIndex + 5] = modelLibrary.normals[face.normalB].z;

						normals[computedFaceVertexIndex + 6] = modelLibrary.normals[face.normalC].x;
						normals[computedFaceVertexIndex + 7] = modelLibrary.normals[face.normalC].y;
						normals[computedFaceVertexIndex + 8] = modelLibrary.normals[face.normalC].z;

					};

					if( face.textureA != null && face.textureB != null && face.textureC != null ){

						uvs[computedFaceTextureIndex + 0] = modelLibrary.textures[face.textureA].u;
						uvs[computedFaceTextureIndex + 1] = modelLibrary.textures[face.textureA].v;

						uvs[computedFaceTextureIndex + 2] = modelLibrary.textures[face.textureB].u;
						uvs[computedFaceTextureIndex + 3] = modelLibrary.textures[face.textureB].v;
						
						uvs[computedFaceTextureIndex + 4] = modelLibrary.textures[face.textureC].u;
						uvs[computedFaceTextureIndex + 5] = modelLibrary.textures[face.textureC].v;

					};

				};

				geometry.setIndex(new THREE.BufferAttribute(indices, 1));
				geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
				geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));
				geometry.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));

				let material = null;

				if( group.material != null && materials[group.material] != undefined ){

					material = materials[group.material];

				}
				else {

					material = new THREE.MeshPhongMaterial({
						color: (Math.random() * 0xFFFFFF)
					});

				};

				let mesh = new THREE.Mesh(geometry, material);

				// mesh.geometry.computeFaceNormals();
				// mesh.geometry.computeVertexNormals();

				if( group.name != null ){

					mesh.name = group.name;

				};

				objectContainer.add(mesh);

			};

			objects.add(objectContainer);

		};

		return objects;

	}
};