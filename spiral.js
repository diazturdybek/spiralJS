/*
SpiralJS 1.0 Beta
Copyright 2022 Diaz Turdybek (diaz.turdybek@mail.ru)
Licensed under MIT
*/



const spiralJS = {
	init(target, config) {
		// SETTINGS START
		Object.assign(this,
			{
				coordX: 0,
				coordY: 0,
				lineSize: 2,
				lineColor: '#FF3867',
				angle: 0,
				distance: 0,
				anglePitch: 0.05,
				distancePitch: 0.025,
				rotatePitch: 0.01,
				rotateCount: 0,
				background: '#010B19',
				FPS: 45,
			},
		config);
		this.canvas = target;
		this.context = this.canvas.getContext('2d');
		this.initial = {
			coordX: this.coordX,
			coordY: this.coordY,
			angle: this.angle,
			distance: this.distance,
		};
		// SETTINGS END
		this.resize();
		window.addEventListener("resize", function() { spiralJS.resize(); });
		setInterval(function() { spiralJS.draw(); }, this.FPS);
	},


	resize() {
		this.canvas.width = this.canvas.offsetParent.offsetWidth;
		this.canvas.height = this.canvas.offsetParent.offsetHeight;
		this.centerX = this.canvas.width / 2;
		this.centerY = this.canvas.height / 2;
		Object.assign(this, this.initial);
	},


	draw() {
		this.context.fillStyle = this.background;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		while(this.coordX < this.canvas.width) {
			this.angle += this.anglePitch;
			this.distance += this.distancePitch;
			this.coordX = this.centerX + (this.distance * this.angle) * Math.cos(this.angle);
			this.coordY = this.centerY + (this.distance * this.angle) * Math.sin(this.angle);
			this.context.fillStyle = this.lineColor;
			this.context.fillRect(this.coordX, this.coordY, this.lineSize, this.lineSize);
		}
		Object.assign(this, this.initial);
		this.rotateCount += 1;
		this.angle += this.rotatePitch * this.rotateCount;
		if(this.rotatePitch * this.rotateCount === 360) {
			this.rotateCount = 0;
		}
	}
}
