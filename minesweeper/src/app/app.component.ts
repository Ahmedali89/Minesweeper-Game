import { Component } from '@angular/core';
import { Cell } from './cell';
import {Board} from './board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title: string = '*********** MineSweeper ***********';

  size = 20;
  mines = 10;
  board: Board;
  
  constructor() {
  	this.reset()
  }

  flag(cell:Cell) {
  	if(cell.status === 3) {
  		cell.status = 1;
  	} else {
  		cell.status = 3;
  	}
  }

  toggleCell(cell:Cell) {
  	let state = this.board.verifyCell(cell)
  	if(state === 1) {
  		alert('YOU WIN !!');
  	}
  }

  reset() {
  	this.board = new Board(20, 25);
  }

}
