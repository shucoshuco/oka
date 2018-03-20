import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {Cell} from '../Cell';
import {Point} from '../Point';
import {GameApiService} from '../game-api.service';
import { imagesPath } from '../globals';

@Component({
  selector: 'app-cell-detail',
  templateUrl: './cell-detail.component.html',
  styleUrls: ['./cell-detail.component.scss']
})
export class CellDetailComponent implements OnInit, OnChanges {

  @Output() done: EventEmitter<void> = new EventEmitter<void>();

  @Input() offsetX: number;
  @Input() offsetY: number;

  @Input() cell: Cell;
  @Input() nitems: number;

  show: boolean;

  title: string;
  description: string;
  cellId: string;

  position: string;
  left: string;
  top: string;
  width: number;
  height: number;

  constructor(private gameService: GameApiService) {}

  ngOnInit() {
    this.show = false;
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['nitems']) {
      this.nitems = changes.nitems.currentValue;
    }
    if (changes['cell']) {
      this.cell = changes.cell.currentValue;
      if (this.cell) {
        this.show = true;
        this.startPoint();
        (this.cell.oka
          ? this.gameService.getOkaDetail(this.nitems > 0)
          : this.gameService.getCellDetail(this.cell))
            .subscribe(this.fillWindow.bind(this));
      } else {
        this.show = false;
      }
    }
  }

  fillWindow(cell) {
    this.title = cell.title;
    this.description = cell.description;
    this.cellId = cell.cellId;
    this.endPoint();
  }

  startPoint() {
    const position: Point = this.cell.innerCellOffset()[0];
    this.left = (this.offsetX + position.x - window.scrollX) + 'px';
    this.top = (this.offsetY + position.y - window.scrollY) + 'px';
    this.width = 0;
    this.height = 0;
  }

  endPoint() {
    this.top = '50%';
    this.left = '50%';
    this.width = Math.max(window.innerWidth / 5, 300);
    this.height = Math.max(window.innerHeight * 2 / 3, 400);
  }

  getImageUrl() {
    return imagesPath + 'cells/' + this.cellId + '.png';
  }

  finished() {
    this.startPoint();
    setTimeout(this.done.emit.bind(this.done), 500);
  }
}
