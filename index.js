$(document).ready(function () {
	GameCanvas = function () {
			this.canvas = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
		};

	GameCanvas.prototype.start = function () {
		this.canvas.setAttribute('id', 'canvas');
		this.canvas.width = 800;
		this.canvas.height = 500;
		
		$('#canvas-area').html(this.canvas);
	}

	GameGrid = function (rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.grid = [];
	};

	GameGrid.prototype.renderOrbs = function () {

	};

	Orb = function(color) {
		this.position  = [];
		this.color     = color;
		this.neighbors = [];
		this.diameter  = 30;
	};

	Orb.prototype.drawOrb = function (orbX, orbY) {
		context = gameCanvas.context;
		context.arc(16, 16, orb.diameter/2, 0, 2 * Math.PI, false);
	    context.fillStyle = 'green';
	    context.fill();
	    context.lineWidth = 1;
	    context.strokeStyle = '#003300';
	    context.stroke();
	};





	//start game! 
	$('#start-button').click(function () {
		gameCanvas = new GameCanvas;
		gameCanvas.start();
		orb = new Orb;
		orb.drawOrb();
	})
})