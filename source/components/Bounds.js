export default class Bounds {
	constructor( size ){

		return this.initialize( size );

	}
	initialize( size ){

		this.min = {
			x: -0,
			y: -0,
			z: -0
		};

		this.max = {
			x: 0,
			y: 0,
			z: 0
		};

		return this;

	}
	measure( x, y, z ){

		x = parseFloat(x);
		y = parseFloat(y);
		z = parseFloat(z);

		this.min.x = (x < this.min.x ? x : this.min.x);
		this.min.y = (y < this.min.y ? y : this.min.y);
		this.min.z = (z < this.min.z ? z : this.min.z);

		this.max.x = (x > this.max.x ? x : this.max.x);
		this.max.y = (y > this.max.y ? y : this.max.y);
		this.max.z = (z > this.max.z ? z : this.max.z);

		return this;

	}
	getSize(){

		return {
			x: this.max.x - this.min.x,
			y: this.max.y - this.min.y,
			z: this.max.z - this.min.z
		};

	}
	getMax(){

		return Math.max(this.max.x, this.max.y, this.max.z);

	}
	getMin(){

		return Math.min(this.min.x, this.min.y, this.min.z);

	}
}