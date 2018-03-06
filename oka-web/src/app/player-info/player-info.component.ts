import {Component, Input, OnInit, Output, EventEmitter, ElementRef} from '@angular/core';
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
  imageUrl: string;
  clothesUrl: string;
  clothesNudeUrl: string;

  constructor(private element: ElementRef) {}

  getNumber(num: number) {
    return num >= 0 ? new Array(num) : [];
  }

  ngOnInit() {
    this.imageUrl = `${imagesPath}${this.player.gender.toString().toLowerCase()}.png`;
    this.clothesUrl = `${imagesPath}/${this.player.gender.toString().toLowerCase()}-clothes.png`;
    this.clothesNudeUrl = `${imagesPath}/${this.player.gender.toString().toLowerCase()}-nude.png`;
  }
}
