import {Cell} from "./cell";

export class Board {
	
	grid: Cell[][] = [];
	private total_cells: number = 0;
	number_of_mines: number = 0;
	save_cells: number = 0;
	private rows:number = 0;
	private columns: number = 0;
	
	constructor(size: number, mines: number) {

		this.total_cells = size*size;
		this.rows = size;
		this.columns = size;
		for (let row= 0; row < size; row++) {
			this.grid[row] = [];
			for (let col = 0; col < size; col++) {
				this.grid[row][col] = new Cell(row,col);
			}
		}

		/*** ASSIGNE MINES ***/
		this.assignMines(mines);

		/*** FIGURING OUT NEIGHBOR MINES FOR EACH CELL ***/
		this.countNeiborMines();

	}

	assignMines(mines: number) {
		/***
			ASSIGNING MINES TO RANDOM CELLS IN THE BOARD
		 ***/

		for (let i = 0; i < mines; i++) {
			const col = Math.floor(Math.random()*this.grid[0].length);
			const row = Math.floor(Math.random()*this.grid.length);

			this.grid[row][col].mine = true;
		} 
	}

	countNeiborMines () {
		/***
			COUNTING ALL MINES AROUND EACH CELL
		***/

		let neighbor_mines = 0;
		for (let row = 0; row < this.grid.length; row ++) {
			for (let col = 0; col < this.grid[0].length; col++) {
				
				neighbor_mines = 0
				let neighbors = this.grid[row][col].getAdjCells(this.rows,this.columns);
				
				for(let dir of neighbors) {
					if(this.grid[row+dir[0]][col+dir[1]] && this.grid[row+dir[0]][col+dir[1]].mine) {
						neighbor_mines++;
					}
				}
				
				/***
					MINES AROUND A CELL IS ADJECENT
				***/
				this.grid[row][col].adjcent_mines = neighbor_mines;

				if(this.grid[row][col].mine){
					this.number_of_mines++;
				}
			}
		}
		/***
			HOW MANY CELLS THAT ARE NOT MINES?
		***/
		this.save_cells = this.total_cells - this.number_of_mines
	}

	revealCells() {
		/***
			REVEAL ALL CELLS REGARDLESS
			OF MINES
		***/
		for(let row = 0; row<this.grid.length; row++) {
			for(let col =0; col < this.grid[0].length; col++) {
				if(this.grid[row][col].status === 1){
					this.grid[row][col].status = 2;
				}
			}
		}
	}

	verifyCell(cell: Cell) {
		/***
			ON CLICK: CHECK CURRENT CELL AND RECURSE TO ALL 
			SURROUNDING 
		***/

		if(cell.status !== 1) {
			/***
				CELL IS ALREADY REVEALED
			 ***/
			// Nothing happen!!
			return 0;
		} else if(cell.mine) {
			/***
				STEP ON A MINE "BOOM!!"
			***/
			this.revealCells();
			return -1;
		} else {
			/***
				REVEAL CURRENT CELL
				AND RECURSE TO NEIGHBORS
			***/
			cell.status = 2;
			if(cell.adjcent_mines == 0) {

				let neighbors = cell.getAdjCells(this.rows,this.columns);
				
				for(let dir of neighbors) {
					if(this.grid[cell.row+dir[0]][cell.col+dir[1]]){
						this.verifyCell(this.grid[cell.row+dir[0]][cell.col+dir[1]])
					}
				}
			}

			this.save_cells--;
			if(this.save_cells <= 1) {
				/***
					FINISHED REVEALING ALL WITHOUT
					STEP ON A MINE 
				***/
				return 1;
			}
			return 0;
		}
	}

}