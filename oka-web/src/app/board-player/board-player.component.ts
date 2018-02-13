import {Component, ElementRef, OnInit, Input, OnChanges, SimpleChange} from '@angular/core';
import {Player} from '../Player';
import {Cell} from '../Cell';
import {Point} from '../Point';

@Component({
  selector: 'app-board-player',
  templateUrl: './board-player.component.html',
  styleUrls: ['./board-player.component.scss']
})
export class BoardPlayerComponent implements OnChanges, OnInit {

  @Input() speed: string;
  @Input() player: Player;
  position: Point;

  constructor(private element: ElementRef) {
    this.position = new Point();
  }

  getSafeChildren() {
    if (this.element.nativeElement.children[0]) {
      return this.element.nativeElement.children[0];
    } else {
      return {offsetWidth: 30, offsetHeight: 30};
    }
  }

  move() {
    this.position.x = this.player.coords.x - (this.getSafeChildren().offsetWidth / 2);
    this.position.y = this.player.coords.y - (this.getSafeChildren().offsetHeight / 2);
  }

  ngOnInit() {

  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.player) {
      this.player = changes.player.currentValue;
      this.move();
    }
  }
}
