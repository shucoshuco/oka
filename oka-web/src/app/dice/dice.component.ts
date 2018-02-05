import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {GameApiService} from '../game-api.service';
import {Movement} from '../Movement';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit {

  @Input() gameId: string;
  @Output() rolled: EventEmitter<Movement>;

  drop: boolean;
  classStatus: string;
  classNumber: string;

  constructor(private gameApi: GameApiService) { }

  prepareRoll() {
    this.drop = false;
    this.classStatus = 'rolling';
  }

  roll() {
    this.classStatus = 'drop';
    this.classNumber = '';
    setTimeout(() => {
      this.gameApi.rollDice(this.gameId)
        .subscribe((mov: Movement) => {
        this.classStatus = '';
        switch (mov.dice) {
          case 1: this.classNumber = 'one'; break;
          case 2: this.classNumber = 'two'; break;
          case 3: this.classNumber = 'three'; break;
          case 4: this.classNumber = 'four'; break;
          case 5: this.classNumber = 'five'; break;
          case 6: this.classNumber = 'six'; break;
        }
        setTimeout( () => {
          this.rolled.emit(mov);
          this.classStatus = 'hidden';
          this.classNumber = '';
        }, 2000);
      });
    }, 2000);
  }

  ngOnInit() {
    this.classStatus = 'hidden';
    this.rolled = new EventEmitter();
  }
}
