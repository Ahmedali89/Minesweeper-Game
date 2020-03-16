import {Tile} from "./tile";

export class Grid {
	
	grid: Tile[][] = [];
	private total_tiles: number = 0;
	number_of_mines: number = 0;
	save_tiles: number = 0;
	private rows:number = 0;
	private columns: number = 0;
	
	constructor(size: number, mines: number) {

		this.total_tiles = size*size;
		this.rows = size;
		this.columns = size;
		for (let row= 0; row < size; row++) {
			this.grid[row] = [];
			for (let col = 0; col < size; col++) {
				this.grid[row][col] = new Tile(row,col);
			}
		}

		/*** ASSIGNE MINES ***/
		this.assignMines(mines);

		/*** FIGURING OUT NEIGHBOR MINES FOR EACH TILE ***/
		this.countNeiborMines();

	}

	assignMines(mines: number) {
		/***
			ASSIGNING MINES TO RANDOM TILES IN THE BOARD
		 ***/

		for (let i = 0; i < mines; i++) {
			const col = Math.floor(Math.random()*this.grid[0].length);
			const row = Math.floor(Math.random()*this.grid.length);

			this.grid[row][col].mine = true;
		} 
	}

	countNeiborMines () {
		/***
			COUNTING ALL MINES AROUND EACH TILE
		***/

		let neighbor_mines = 0;
		for (let row = 0; row < this.grid.length; row ++) {
			for (let col = 0; col < this.grid[0].length; col++) {
				
				neighbor_mines = 0
				let neighbors = this.grid[row][col].getAdjTiles(this.rows,this.columns);
				
				for(let dir of neighbors) {
					if(this.grid[row+dir[0]][col+dir[1]] && this.grid[row+dir[0]][col+dir[1]].mine) {
						neighbor_mines++;
					}
				}
				
				/***
					MINES AROUND A TILE IS ADJECENT
				***/
				this.grid[row][col].adjcent_mines = neighbor_mines;

				if(this.grid[row][col].mine){
					this.number_of_mines++;
				}
			}
		}
		/***
			HOW MANY TILES THAT ARE NOT MINES?
		***/
		this.save_tiles = this.total_tiles - this.number_of_mines
	}

	revealTiles() {
		/***
			REVEAL ALL TILES REGARDLESS
			OF MINES
		***/
		for(let row = 0; row<this.grid.length; row++) {
			for(let col =0; col < this.grid[0].length; col++) {
				if(this.grid[row][col].status === 1 ||this.grid[row][col].status === 3){
					this.grid[row][col].status = 2;
				}
			}
		}
	}

	checkAllMinesFlaged() {
		let flagged_mines = 0 
		for(let row = 0; row<this.grid.length; row++) {
			for(let col =0; col < this.grid[0].length; col++) {
				if(this.grid[row][col].mine && this.grid[row][col].status === 3){
					flagged_mines++;
				}
			}
		}
		return flagged_mines === this.number_of_mines;
	}

	verifyTile(tile: Tile) {
		/***
			ON CLICK: CHECK CURRENT TILE AND RECURSE TO ALL 
			SURROUNDING 
		***/

		if(tile.status !== 1) {
			/***
				TILE IS ALREADY REVEALED
			 ***/
			// Nothing happen!!
			return 0;
		} else if(tile.mine) {
			/***
				STEP ON A MINE "BOOM!!"
			***/
			this.revealTiles();
			return -1;
		} else {
			/***
				REVEAL CURRENT TILE
				AND RECURSE TO NEIGHBORS
			***/
			tile.status = 2;
			if(tile.adjcent_mines == 0) {

				let neighbors = tile.getAdjTiles(this.rows,this.columns);
				
				for(let dir of neighbors) {
					if(this.grid[tile.row+dir[0]][tile.col+dir[1]]){
						this.verifyTile(this.grid[tile.row+dir[0]][tile.col+dir[1]])
					}
				}
			}

			this.save_tiles--;
			if(this.save_tiles <= 1 ) {
				/***
					FINISHED REVEALING ALL WITHOUT
					STEP ON A MINE 
				***/
				if(this.checkAllMinesFlaged())
					return 1;
			}
			return 0;
		}
	}

}