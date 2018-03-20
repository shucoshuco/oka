import {Component, Input, OnInit, Output, EventEmitter, ElementRef, SimpleChange} from '@angular/core';
import {Player} from '../Player';

import {imagesPath} from '../globals';
import { Point } from '../Point';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit {

  @Input() player: Player;
  @Input() offsetX: number;
  @Input() offsetY: number;
  @Input() speed: string;
  @Input() playerY: number;
  @Input() playerX: number;

  imageUrl: string;
  clothesUrl: string;
  clothesNudeUrl: string;

  position: Point;
  margin: Point;
  playerFileClass: string;
  playerFileImageUrl: string;

  constructor(private element: ElementRef) {
    this.position = new Point();
    this.margin = new Point(0, 0);
  }

  getNumber(num: number) {
    return num >= 0 ? new Array(num) : [];
  }

  getSafePlayerFile() {
    if (this.element.nativeElement.children[0].children[1]) {
      return this.element.nativeElement.children[0].children[1];
    } else {
      return {offsetWidth: 30, offsetHeight: 30};
    }
  }

  ngOnInit() {
    this.imageUrl = `${imagesPath}${this.player.gender.toString().toLowerCase()}.png`;
    this.playerFileImageUrl = `${imagesPath}${this.player.gender.toString().toLowerCase()}.png`;
    this.clothesUrl = `${imagesPath}/${this.player.gender.toString().toLowerCase()}-clothes.png`;
    this.clothesNudeUrl = `${imagesPath}/${this.player.gender.toString().toLowerCase()}-nude.png`;
    setTimeout(this.init.bind(this), 1000);
  }

  init() {
    this.playerFileClass = 'playing';
    this.playerFileImageUrl = `${imagesPath}${this.player.gender.toString().toLowerCase()}-shadow.png`;
    this.margin.x = -0.65;
    this.margin.y = -0.65;
    this.position.x = this.getSafePlayerFile().offsetLeft;
    this.position.y = this.getSafePlayerFile().offsetTop;
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
    this.position.y = this.offsetY + this.playerY - (this.getSafePlayerFile().offsetHeight / 2);
    this.position.x = this.offsetX + this.playerX - (this.getSafePlayerFile().offsetWidth / 2);
    this.margin.x = 0;
    this.margin.y = 0;
  }
}
