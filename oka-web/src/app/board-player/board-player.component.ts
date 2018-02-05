import {Component, ElementRef, OnInit, Input, OnChanges, SimpleChange} from '@angular/core';
import {Gender} from '../Gender';
import {Player} from '../Player';
import {Cell} from '../Cell';

@Component({
  selector: 'app-board-player',
  templateUrl: './board-player.component.html',
  styleUrls: ['./board-player.component.scss']
})
export class BoardPlayerComponent implements OnChanges, OnInit {

  @Input() speed: string;
  @Input() player: Player;
  @Input() cells: Cell [];
  position: any;

  constructor(private element: ElementRef) { }

  getSafeChildren() {
    if (this.element.nativeElement.children[0]) {
      return this.element.nativeElement.children[0];
    } else {
      return {offsetWidth: 30, offsetHeight: 30};
    }
  }

  move() {
    console.log(this.player.position);
    console.log(this.cells);
    console.log(this.player);
    const pos = this.cells[this.player.position].innerCellOffset(1);
    this.position = {
      x: pos[0] - (this.getSafeChildren().offsetWidth / 2),
      y: pos[1] - (this.getSafeChildren().offsetHeight / 2),
    };
  }

  ngOnInit() {
    this.position = {
      x: 0,
      y: 0,
    };
    setTimeout(this.move.bind(this), 2000);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.cells) {
      this.cells = changes.cells.currentValue;
    } if (changes.player) {
      this.player = changes.player.currentValue;
    }
  }
}
