import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {OkaGameApiService} from '../oka-game-api.service';
import {Movement} from '../Movement';
import { Player } from '../Player';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit {

  @Output() onRolled: EventEmitter<Movement> = new EventEmitter();
  _show: boolean;
  _playerName: string;

  drop: boolean;
  classStatus: string;
  classNumber: string;

  constructor(private gameApi: OkaGameApiService) { }

  @Input()
  set show(show: boolean) {
    this._show  = show;
    if (show) {
      this.drop = false;
      console.log('Rolling dice');
    }
    this.classStatus = 'rolling';
  }

  get show() {
    return this._show;
  }

  @Input()
  set playerName(name: string) {
    console.log("Name: " + name);
    this._playerName = name;
  }

  get playerName() {
    return this._playerName;
  }

  static parseMovement(mov) {
    const movement = new Movement();
    Object.assign(movement, mov);
    movement.end = mov.status.finished;
    movement.winner = mov.status.winner;
    if (mov.jumpInfo) {
      movement.jumpInfo = Object.assign(new Movement(), mov.jumpInfo);
    }
    return movement;
  }

  rollDice() {
    this.classStatus = 'drop';
    this.classNumber = '';
    setTimeout(() => {
      this.gameApi.rollDice()
        .subscribe((mov: Movement) => {
        this.classStatus = '';
        switch (mov.dice) {
          case 0: this.classNumber = 'zero'; break;
          case 1: this.classNumber = 'one'; break;
          case 2: this.classNumber = 'two'; break;
          case 3: this.classNumber = 'three'; break;
          case 4: this.classNumber = 'four'; break;
          case 5: this.classNumber = 'five'; break;
          case 6: this.classNumber = 'six'; break;
        }
        setTimeout( () => {
          this.onRolled.emit(DiceComponent.parseMovement(mov));
          this.classNumber = '';
          this.classStatus = 'rolling';
          if (mov.dice > 0) {
            this.show = false;
          }
        }, 2000);
      });
    }, 2000);
  }

  ngOnInit() {
    this.classStatus = 'hidden';
  }

  pause() {
    this._show = false;
  }
}
