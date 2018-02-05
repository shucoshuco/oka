import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../Player';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit {

  @Input() player: Player;
  imageUrl: string;
  clothesUrl: string;

  getNumber(num: number) {
    return num >= 0 ? new Array(num) : [];
  }

  ngOnInit() {
    this.imageUrl = `../../assets/normal/${this.player.gender.toString().toLowerCase()}.png`;
    this.clothesUrl = `../../assets/normal/${this.player.gender.toString().toLowerCase()}-clothes.png`;
  }
}
