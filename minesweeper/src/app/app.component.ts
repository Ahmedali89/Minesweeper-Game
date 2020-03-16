import { Component } from '@angular/core';
import { Tile } from './tile';
import {Grid} from './grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title: string = '*********** MineSweeper ***********';

  size = 20;
  mines = 10;
  board: Grid;
  
  constructor() {
  	this.board = new Grid(20, 5);
  }

  flag(tile:Tile) {
  	if(tile.status === 3) {
  		tile.status = 1;
  	} else {
  		tile.status = 3;
      if(this.board.checkAllMinesFlaged()){
        alert('YOU WIN !!');
      }
  	}
  }

  toggleTile(tile:Tile) {
    /***
	  	CLICK ON A Tile 
	  	MUST TRIGGER VERIFYTILE FUNC TO ALL SURROUDING
    ***/
  	let state = this.board.verifyTile(tile)
    if(state === 1) {
      alert('YOU WIN !!');
    }
  }


  reset() {
  	/***
  		RESTART GAME
  	***/
  	this.board = new Grid(20, 5);
  }

}
