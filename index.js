$(document).ready(function () {
	
	/*visible canvas area*/
	GameCanvas = function () {
			this.canvas = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
			this.grid = new GameGrid();
	};

	/* populates canvas with visible orbs */
	GameCanvas.prototype.fillCanvas = function (gameGrid) {
		for (var j=0; j<5; j++) {
			for (var i=0; i<15;i++) {
				var orb = gameGrid.grid[j][i],
					orbX = 15 + (gameGrid.grid[j][i].position[0] * 30),
					orbY = 15 + (gameGrid.grid[j][i].position[1] * 30);
				
				if (j % 2 != 0) orbY += 15; 
		
				orb.drawOrb(orbY, orbX);	
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
		this.rows = 15;
		this.cols = 15;
		
		for (var j = 0; j<5; j++) {
			var row = [];
			for (var i = 0; i<this.rows; i++){
				var orb = new Orb('red', [j, i]);
				row.push(orb);
			}
			this.grid[j] = row;
		}
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
		gameGrid = new GameGrid;
		console.log(gameGrid);
		gameGrid.fillGrid();
		gameCanvas.start();
		gameCanvas.fillCanvas(gameGrid);
	});




})