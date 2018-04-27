import { Component, OnInit, Input } from '@angular/core';
import { DicesGameApiService } from './dices-game-api.service';
import { ActivatedRoute } from '@angular/router';
import { Time } from './Time';
import { Movement } from './Movement';
import { Position } from './Position';
import { imagesPath } from '../../globals';


@Component({
  selector: 'app-dices-game',
  templateUrl: './dices-game.component.html',
  styleUrls: ['./dices-game.component.scss']
})
export class DicesGameComponent implements OnInit {

  positionDiceValue: number;
  timeDiceValue: number;

  loading: boolean;
  rolling: boolean;
  showDices: boolean;

  step: number;
  buttonText: string;

  positions: Position[];
  times: Time[];

  positionsUrls: string[];
  timesTexts: string[];

  selectedPosition: Position;
  selectedTime: Time;

  constructor(private route: ActivatedRoute, private gameApi: DicesGameApiService) {}

  ngOnInit() {

    this.loading = true;
    this.showDices = true;
    this.rolling = true;
    
    this.gameApi.getGame().subscribe((game) => {
      this.positions = game['positions'];
      this.times = game['times'];
      this.step = 1;
      this.buttonText = 'Roll dices';

      this.fillPositionsUrl();

      this.positionsUrls = this.positions.map(p => 'url("' + p.url + '")');
      this.timesTexts = this.times.map(t => t.time);

      this.loading = false;
    });
  }

  private fillPositionsUrl() {
    this.positions.forEach(position =>
      position.url = imagesPath + 'cells/' + position.url + '.png'
    );
  }

  nextStep() {
    switch (this.step) {
      case 1:
        this.gameApi.rollDice().subscribe((movement) => {
          this.rolling = false;
          this.positionDiceValue = movement.positionDice;
          this.selectedPosition = this.positions[this.positionDiceValue];
          this.timeDiceValue = movement.timeDice;
          this.selectedTime = this.times[this.timeDiceValue];
          setTimeout(() => this.showDices = false, 5000);
          this.buttonText = 'Next';
        })
        break;
      case 2:
        this.positionDiceValue = -1;
        this.timeDiceValue = -1;
        this.rolling = true;
        this.showDices = true;
        this.buttonText = 'Roll Dices';
        break;
    }
    this.step++;
    if (this.step > 2) {
      this.step = 1;
    }
  }
}
