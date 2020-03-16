

export class Tile {

	/*** 
		status var decides the state of a tile
		1: unrevealed
		2: revealed
		3: flag
		default val for a tile is unrevealed {1}
	 ***/

	status: 1 | 2 | 3 = 1 ;
	mine = false;
	adjcent_mines = 0;
	row: number;
	col: number;

	constructor(row: number, column: number) {
		/***
			A TILE SHOULD KNOW ITS LOCATION
		***/
		this.row = row;
		this.col = column;
	}

	getAdjTiles(rows:number,columns:number) {
        /***
        	FINDING NEIGHBORS OF A TILE
        ***/

        let adj = [];

        if (this.row > 0 && this.col > 0) adj.push([-1,-1]);
        if (this.row > 0) adj.push([-1,0]);
        if (this.row > 0 && this.col < columns-1) adj.push([-1,1]);
        if (this.col < columns-1) adj.push([0,1]);
        if (this.row < rows-1 && this.col < columns-1) adj.push([1,1]);
        if (this.row < rows-1) adj.push([1,0]);
        if (this.row < rows-1 && this.col > 0) adj.push([1,-1]);
        if (this.col > 0) adj.push([0,-1]); 

        return adj;
    }
}