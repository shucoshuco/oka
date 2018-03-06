import {Component, ElementRef, OnInit, Input, OnChanges, SimpleChange} from '@angular/core';
import {Point} from '../Point';
import {Gender} from '../Gender';

@Component({
  selector: 'app-board-player',
  templateUrl: './board-player.component.html',
  styleUrls: ['./board-player.component.scss']
})
export class BoardPlayerComponent implements OnChanges, OnInit {

  @Input() offsetX: number;
  @Input() offsetY: number;
  @Input() gender: Gender;
  @Input() speed: string;
  @Input() playerY: number;
  @Input() playerX: number;
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

  ngOnInit() {
    let element = this.getSafeChildren();
    this.position.x = element.offsetLeft;
    this.position.y = element.offsetTop - 10;
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['offsetY']) {
      this.offsetY = changes['offsetY'].currentValue;
    }
    if (changes['offsetX']) {
      this.offsetX = changes['offsetX'].currentValue;
    }
    if (changes['playerY']) {
      this.playerY = changes['playerY'].currentValue;
    }
    if (changes['playerX']) {
      this.playerX = changes['playerX'].currentValue;
    }
    this.position.y = this.offsetY + this.playerY - (this.getSafeChildren().offsetHeight / 2);
    this.position.x = this.offsetX + this.playerX - (this.getSafeChildren().offsetWidth / 2);
  }
}
