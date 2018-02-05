import { Component, OnInit, Input } from '@angular/core';
import {Cell} from '../Cell';
import {CellImagePipe} from '../cell-image.pipe';

@Component({
  selector: 'app-board-cell',
  templateUrl: './board-cell.component.html',
  styleUrls: ['./board-cell.component.scss']
})
export class BoardCellComponent {

  @Input() cell: Cell;

  constructor(private cellImagePipe: CellImagePipe) {}

  getUrl() {
    return 'url("' + this.cellImagePipe.transform(this.cell) + '")';
  }

}
