import {Cell} from "./cell";

export class Board {
	
	grid: Cell[][] = [];
	private totalCells: number = 0;
	numberOfMines: number = 0;
	saveCells: number = 0;
	private rows:number = 0;
	private columns: number = 0;
	
	constructor(size: number, mines: number) {

		this.totalCells = size*size;
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
			const row = Math.floor(Math.random()*this.grid.length);
			const col = Math.floor(Math.random()*this.grid[0].length);
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
					if(this.grid[row+dir[0]] && this.grid[row+dir[0]][col+dir[1]] && this.grid[row+dir[0]][col+dir[1]].mine) {
						neighbor_mines++;
					}
				}
				this.grid[row][col].adjcent_mines = neighbor_mines;

				if(this.grid[row][col].mine){
					this.numberOfMines++;
				}
			}
		}

		this.saveCells = this.totalCells - this.numberOfMines
	}

	revealCells() {
		for(let row = 0; row<this.grid.length; row++) {
			for(let col =0; col < this.grid[0].length; col++) {
				if(this.grid[row][col].status === 1){
					this.grid[row][col].status = 2;
				}
			}
		}
	}

	verifyCell(cell: Cell) {

		if(cell.status !== 1) {
			// Nothing happen!!
			return 0;
		} else if(cell.mine) {
			this.revealCells();
			return -1;
		} else {
			cell.status = 2;
			if(cell.adjcent_mines == 0) {

				let neighbors = cell.getAdjCells(this.rows,this.columns);
				


				for(let dir of neighbors) {
					if(this.grid[cell.row+dir[0]][cell.col+dir[1]]){
						this.verifyCell(this.grid[cell.row+dir[0]][cell.col+dir[1]])
					}
				}
			}

			if(this.saveCells-- <= 1) {
				return 1;
			}
			return 0;
		}
	}

}