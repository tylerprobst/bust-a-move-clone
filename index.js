$(document).ready(function () {
	
	/* visible canvas area */
	GameCanvas = function () {
			this.canvas  = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
			this.grid    = new GameGrid();
			this.queue   = new Queue();
			this.mouseCoords = [];
			this.angle   = 0;
	};

	/* populates canvas with visible orbs */
	GameCanvas.prototype.fillCanvas = function () {
		for (var j=0; j < this.grid.rows; j++) {
			for (var i=0; i < this.grid.cols; i++) {
				var orb = this.grid.grid[j][i];
				orb.drawOrb();	
			}
		}
	};

	GameCanvas.prototype.start = function () {
		this.canvas.setAttribute('id', 'canvas');
		this.canvas.width = 465;
		this.canvas.height = 600;
		
		$('#canvas-area').html(this.canvas); //adds canvas to the canvas area
		this.grid.fillGrid(); // fills the grid with orb data
		this.fillCanvas(); // fills the canvas with visible orbs
		this.drawQueuedOrbs();
	};

	GameCanvas.prototype.drawAimer = function (mouseCoords) {
		var aimerX = 230,
			aimerY = 600,
			mouseAngle = getCurrentMouseAngle(mouseCoords);

		this.mouseCoords = mouseCoords,
    	
    	renderAimer(this);	

		function renderAimer (that) {
			var curr = that.queue.curr;

			context.clearRect(205, 560, 50, 50);
			if (curr.X === 230) curr.drawOrb();
			that.context.beginPath();
			context.lineWidth = 3;
			context.strokeStyle = "green";	
			that.context.moveTo(aimerX, aimerY - 15);
			that.context.lineTo(aimerX + 1.5 * 15 * Math.cos(degToRad(mouseAngle)),
							   (aimerY - 15) - 1.5 * 15 * Math.sin(degToRad(mouseAngle))); 
			that.context.stroke();	
		};
	};

	GameCanvas.prototype.drawQueuedOrbs = function () {  //remove nested function from this attr
		var curr = this.queue.curr,
			onDeck = this.queue.onDeck;

		curr.drawOrb(); //draws first orb in queue to pointer location
		onDeck.drawOrb();
	};

	// GameCanvas.prototype.shootOrb = function () {
	// 	var curr = this.queue.curr,
	// 		now  = new Date().getTime(),
 //        	dt   = now - (time || now),
	// 		time;
		
	// 	console.log(dt);

	// 	time = now;
	// 	curr.X += dt * curr.speed * Math.cos(degToRad(this.angle));
	// 	curr.Y += dt * curr.speed * (-1 * Math.cos(degToRad(this.angle)));

	// }

	/* array grid to store orb data and locations */
	GameGrid = function () {
		this.grid = [];                 //[row][col]
		this.cols = 15;
		this.rows = 10;
		this.totalRows = 19;
	};

	GameGrid.prototype.fillGrid = function () {   /* populates grid with initial orbs */
		
		for (var j = 0; j < this.totalRows; j++) {
			var row = [];
			for (var i = 0; i < this.cols; i++){
				if (j < this.rows) {
					var orb = new Orb([j, i]);
					row.push(orb);
				}
				else {
					row.push('empty');
				}
			}
			this.grid[j] = row;
		}
	};

    /* Orb Class */
	Orb = function (position) {
		this.position  = position;
		this.color     = randomColor();
		this.neighbors = [];
		this.diameter  = 30;
		this.X 	       = this.getOrbCoords()[0];
		this.Y 	       = this.getOrbCoords()[1];
		// this.gridPos   = this.getGridPosition();
		this.speed     = .75;
		this.angle     = 1;

		function randomColor() {
			var colors = ['#FFE600'/* yellow */,
						  '#C9C9C9'/* gray */,
						  '#FF0000'/* red */,
						  '#1464F4'/* blue */,
						  '#00EE00'/* green */,
						  '#FF00FF' /* purple */,
						  '#00FFFF'/* light blue */];
		
			return colors[Math.floor(Math.random() * colors.length)];
		};
	};

	Orb.prototype.findNeighbors = function () {
		this.neighbors = getNeighbors(this.position);
		console.log('neighbors', this.neighbors);
	};

	Orb.prototype.drawNeighbors = function () {

		for (var i = 0; i < this.neighbors.length; i++) {
			this.neighbors[i].drawOrb();
		}
	};

	Orb.prototype.getOrbCoords = function (position) {
		var row       = this.position[0],
			col       = this.position[1],
			rowHeight = 29,
			X         = 15 + this.diameter * col,
			Y         = 15 + rowHeight * row;

		if (row % 2 != 0) X += 15;

		return [X, Y];   //returns center [x, y] of orb
	};

	Orb.prototype.getGridPosition = function () {   // x and y will be the coordinates of the center of an orb
		var rowHeight = 29,
			x         = this.X,
			y         = this.Y,
			row       = Math.floor(y / rowHeight),
			rowOffset = 0,
			col;

		if (row % 2 != 0) rowOffset = 15;

		col = Math.floor((x-rowOffset) / this.diameter);

		this.position = [row, col];

		return {row: row, col: col};
	};

	/* Draws singular Orb */
	Orb.prototype.drawOrb = function (x, y) {   //draws the orb to the current x,y position
		context = gameCanvas.context;
		context.beginPath();
		if (x && y) {
			context.arc(x, y, this.diameter/2, 0, 2 * Math.PI, false);	
		}
		else {
			context.arc(this.X, this.Y, this.diameter/2, 0, 2 * Math.PI, false);
		}
	    context.fillStyle = this.color;
	    context.fill();
	    context.lineWidth = 2;
	    context.strokeStyle = '#003300';
	    context.closePath();
	    context.stroke();
	};

	Orb.prototype.clearOrb = function (x, y) {    //clears the current space the orb occupies
		context = gameCanvas.context;
		context.beginPath();
		if (x && y) {
			context.arc(x, y, this.diameter/2, 0, 2 * Math.PI, false);	
		}
		else {
			context.arc(this.X, this.Y, (this.diameter/2)+ .55, 0, 2 * Math.PI, false);
		}
	    context.fillStyle = 'white';
	    context.fill();
	    context.lineWidth = 0;
	    context.strokeStyle = 'white';
	    context.closePath();
	    context.stroke();
	};

	Orb.prototype.findCluster = function () { 
		var isSame = [this];

		this.findNeighbors();
			
		for (var i = 0; i < this.neighbors.length; i++) {
			neigh = this.neighbors[i];
			
			if (neigh.color === this.color) {
				isSame.push(neigh);
				cluster(neigh, this);
			}
		}

		function cluster(curr, last) {
			curr.findNeighbors();
			for (var j = 0; j < curr.neighbors.length; j++) {
				var orb = curr.neighbors[j];

				if (orb.color === curr.color && orb.position != last.position) {
					for (var i = 0; i < isSame.length; i++) {
						if (isSame[i].position === orb.position) return;
					}
					isSame.push(orb);
					cluster(orb, curr);
				}
			}
		}

		if (isSame.length > 2) {
			console.log('isSame', isSame);
			for (var i = 0; i < isSame.length; i++) {
				isSame[i].clearOrb();
				clearGrid(isSame[i]);
			}
		}
	};

	Queue = function () {
		this.currPos   = [18, 7]; 
		this.onDeckPos = [19, 1];
		this.curr      = new Orb(this.currPos);
		this.onDeck    = new Orb(this.onDeckPos);
		this.curr.X    = 230;
		this.curr.Y    = 585;
		this.onDeck.X  = 170; 
		this.onDeck.Y  = 585;
	};

	Queue.prototype.nextOrb = function () {
		this.curr = this.onDeck;
		this.onDeck = new Orb(this.onDeckPos);
		this.curr.X    = 230;
		this.curr.Y    = 585;
		this.onDeck.X  = 170; 
		this.onDeck.Y  = 585;
		this.onDeck.clearOrb();
		this.onDeck.drawOrb();
		this.curr.drawOrb();
	};
//						TO-DO:
//-------------------------------------------------------
//refactor drawing queued orbs to the canvas instead of directing passing the coords in to the drawOrb func
//install dependencies locally
//find clusters of orbs
//find floating orbs after clusters have been removed
//add row of orbs at top once certain shot count has been reached.
//refactor mouse angle calculations, as they seem to be just slightly off
//add mouseangle limiting calculations
//add reset button?
//add fps?
//add score?


/*life as a whole is a collective intelligence, sometimes i will hear an answer to a question i have asked myself in my head. seemingly it has
 come out of no where. is this me tapping into the answers from another human being or form of existence or is it from my purely random imagination.
 obviously it has to have come from somewhere. What mysteries lay trapped inside my mind. What answers lay in there.*/

	var gameCanvas = new GameCanvas,
		shotCount  = 0;

	$('#start-button').click(function () {
		$('#start-button').off();
		gameCanvas.start();
		mouseCoordsOnCanvas(); //handles drawAimer initiation, eventually will want to make this an attribute on the gameCanvas|* * *|
		
		$('#canvas').click(animateLoop);

			//returns current mouse X and Y relative to canvas
		function mouseCoordsOnCanvas() {
			var canvasTop  = gameCanvas.canvas.getBoundingClientRect().top,
				canvasLeft = gameCanvas.canvas.getBoundingClientRect().left,
				canvasX, canvasY, mouseCoords;

			$('#canvas').on('mousemove', getMouseCoords);
			
			function getMouseCoords (event) {
				canvasX = event.pageX - canvasLeft;
				canvasY = event.pageY - canvasTop;
				mouseCoords = [canvasX, canvasY];
				gameCanvas.drawAimer(mouseCoords);
			};	
		};
	});

	/* ***************** PUBLIC FUNCTIONS *********************** */

	function animateLoop () {
		$('#canvas').off('click');
		var curr = gameCanvas.queue.curr,
			time;

		curr.angle = getCurrentMouseAngle(gameCanvas.mouseCoords);
		// draw();
		var animFrame = requestAnimationFrame(draw);

		function draw() {     /***************** BREAK THIS OUT INTO Orb.shootOrb ?*******************************/
			var now = new Date().getTime(),
    			dt = now - (time || now);

		    time = now;
		    
		    curr.clearOrb();
			
			if (curr.X-15 <= 0) {   //if orb hits left bounce off wall
				curr.angle = 180 - curr.angle;
				curr.X = 15;
			}
			else if (curr.X + 15 >= gameCanvas.canvas.width) {  //if orb hits right bounce off wall
				curr.angle = 180 - curr.angle;
				curr.X = gameCanvas.canvas.width - 15;
			}

			if (curr.Y <= 0) {   //if orb hits top snap to grid
				curr.Y = 0;
				snapOrb();
				cancelAnimationFrame(animFrame);
				return;
			}

			var rows = gameCanvas.grid.totalRows,
				cols = gameCanvas.grid.cols;

			for (var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					var orb = gameCanvas.grid.grid[i][j];

					if (orb === 'empty') continue;

					if (circleIntersection(curr.X, curr.Y, curr.diameter/2, orb.X, orb.Y, orb.diameter/2)) {
						snapOrb();
						cancelAnimationFrame(animFrame);
						return;
					}
				}
			}

			curr.X += dt * curr.speed * Math.cos(degToRad(curr.angle));
			curr.Y += dt * curr.speed * (-1 * Math.sin(degToRad(curr.angle)));
			curr.drawOrb();
			requestAnimationFrame(draw);
		}
	};

	function getNeighbors (position) {
		var neighboroffsets = [[[1, 0], [1, -1], [0, 1], [0, -1], [-1, 0], [-1, -1]],   
                       			[[-1, 1], [-1, 0], [0, -1], [0, 1], [1, 1], [1, 0]]],
            rowOff          = position[0] % 2 === 0 ? 0 : 1,
            grid            = gameCanvas.grid,
            result          = [];
            
		for (var i = 0; i < neighboroffsets[rowOff].length; i++) {
			var rowDiff = neighboroffsets[rowOff][i][0],
				colDiff = neighboroffsets[rowOff][i][1],
				row = position[0],
				col = position[1],
				neighRow = row + rowDiff,
				neighCol = col + colDiff;


			if (neighRow < 0 || neighRow >= grid.totalRows || neighCol < 0 || neighCol >= grid.cols) { 
				continue;
			}
			else {
				var neighbor = grid.grid[neighRow][neighCol];
				if (neighbor != 'empty') {
					result.push(neighbor);
				}
			}	
		}

		return result;
	}

	function radToDeg(angle) {     				//turns radians into degrees
	    return angle * (180 / Math.PI);
	}

	function degToRad(angle) {					// turns degrees into radians
		return angle * (Math.PI / 180);
	}

	function getCurrentMouseAngle(mouseCoords) {   //returns the current angle of the mouse relative to the queued orb
		var x = mouseCoords[0],
			y = mouseCoords[1],
			aimerX = 230,
			aimerY = 600,
			mouseAngle = radToDeg(Math.atan2((aimerY+15) - y, x - (aimerX+15)));
			
		if (mouseAngle < 0) {
        	mouseAngle = 180 + (180 + mouseAngle);
    	}

		return mouseAngle;
	}

	function circleIntersection(x1, y1, r1, x2, y2, r2) {  //checks to see if the 2 circles intersect
		var dx = x1 - x2,
			dy = y1 - y2,
			len = Math.sqrt(dx * dx + dy * dy);

		if (len < r1 + r2) return true;

		return false;
	}

	function snapOrb() {                     //puts orb into data grid
		var curr = gameCanvas.queue.curr,
			grid = gameCanvas.grid.grid,
			rowOffset = 0;

		curr.clearOrb();
		curr.getGridPosition();
		
		var row = curr.position[0],
			col = curr.position[1];

		if (curr.position[0] % 2 != 0) rowOffset = 15;
		
		curr.X = curr.diameter/2 + col * curr.diameter + rowOffset;
		curr.Y = curr.diameter/2 + row * 29;
		
		grid[row][col] = curr;

		curr.drawOrb();
		curr.findNeighbors();
		curr.drawNeighbors();
		curr.findCluster();
		gameCanvas.queue.nextOrb();

		// shotCount++;
		// if (shotCount > 2) {
		// 	addRow();
		// 	shotCount = 0;
		// }

		$('#canvas').click(animateLoop);

	}

	function addRow() {
		var grid   = gameCanvas.grid.grid,
			rows   = gameCanvas.grid.totalRows,
			cols   = gameCanvas.grid.cols;

		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				var orb = grid[i][j];
				if (orb === 'empty') continue;
				orb.position = [orb.position[0]+1, orb.position[1]];

				var coords = orb.getOrbCoords();
				
				orb.X = coords[0];
				orb.Y = coords[1];
				orb.drawOrb();
			}

		}

		resetGrid();
		
		grid[0] = generateRow();

		function generateRow() {
			var result = [];

			for (var i = 0; i < cols; i++) {
				result.push(new Orb([0, i]));
				result[i].drawOrb();
			}

			return result;
		}
	}

	function clearGrid(orb) {
		var row = orb.position[0],
			col = orb.position[1],
			grid = gameCanvas.grid.grid;

		grid[row][col] = 'empty';
	}

	function resetGrid(){
		var grid   = gameCanvas.grid.grid,
			rows   = gameCanvas.grid.totalRows,
			cols   = gameCanvas.grid.cols;

		for (var i = rows; i > 0; i--) {
			for (var j = cols; j < 0; j--) {
				var orb = grid[i][j];

				if (i != rows) grid[i+1][j] = orb;
			}
		}
	}
})