$(document).ready(function () {
	
	/*visible canvas area*/
	GameCanvas = function () {
			this.canvas = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
			this.grid = new GameGrid();
	};

	/* populates canvas with visible orbs */
	GameCanvas.prototype.fillCanvas = function () {
		var diff = 15;
		for (var j=15; j<106; j+=30) {
			for (var i=15; i<465;i+=30) {
				orb = new Orb('red', [i, j]);
				orb.drawOrb(orb.position[0], orb.position[1]);
				diff += 30;	
			}
		}
	};

	GameCanvas.prototype.start = function () {
		this.canvas.setAttribute('id', 'canvas');
		this.canvas.width = 465;
		this.canvas.height = 600;
		
		$('#canvas-area').html(this.canvas);
	};

	/* grid to store orbs and locations */
	GameGrid = function (rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.grid = [];
	};

	/*populates grid with orbs*/
	GameGrid.prototype.fillGrid = function () {
		orb = new Orb('red', [i, j]);
	};

    /* Orb Class */
	Orb = function(color, position) {
		this.position  = position; //array [x,y]
		this.color     = color;
		this.neighbors = [];
		this.diameter  = 30;
	};

	/* Draws singular Orb */
	Orb.prototype.drawOrb = function (orbX, orbY) {
		context = gameCanvas.context;
		context.beginPath();
		context.arc(orbX, orbY, this.diameter/2, 0, 2 * Math.PI, false);
	    context.fillStyle = this.color;
	    context.fill();
	    context.lineWidth = 2;
	    context.strokeStyle = '#003300';
	    context.closePath();
	    context.stroke();
	};
//						TO-DO:
//-------------------------------------------------------
//calculate individual orbs position
//function for randomizing orb color
//function for filling the board with randommized orbs
//fill grid according to how many orbs fit in a row
//calculate how many orbs fit in a row
//at start of game fill 5 rows with orbs
//offset every other row (orb.diameter/2)
//make contributions show up on github account

	//start game! 
	$('#start-button').click(function () {
		gameCanvas = new GameCanvas;
		gameCanvas.start();
		gameCanvas.fillCanvas();
	});




})