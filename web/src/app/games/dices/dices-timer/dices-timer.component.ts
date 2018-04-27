import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Position } from '../Position';
import { Time } from '../Time';

@Component({
  selector: 'app-dices-timer',
  templateUrl: './dices-timer.component.html',
  styleUrls: ['./dices-timer.component.scss']
})
export class DicesTimerComponent implements OnInit {

  running: boolean;
  timer: string;

  @Input()
  diceValue: Time;

  @Output() onTimeOut: EventEmitter<void> = new EventEmitter();

  printTime(time) {
    if (time < 0) {
      this.timer = '00m 00s 0d';
    } else {
      const minutes = Math.floor(time / (1000 * 60));
      const seconds = Math.floor(time / 1000) % 60;
      const elapsed = Math.floor((time % 1000) / 100);
      this.timer = 
        (minutes < 10 ? '0' + minutes : '' + minutes) + 'm '
        + (seconds < 10 ? '0' + seconds : seconds) + 's '
        + elapsed + 'd';
    }
  }

  ngOnInit() {
    this.printTime(this.diceValue.seconds * 1000);
    this.running = false;
  }

  start() {
    let end = new Date().getTime() + this.diceValue.seconds * 1000;
    this.running = true;
    var refreshIntervalId =
      setInterval(() => {
        const time = end - new Date().getTime();
        this.printTime(time);
        if (time <= 0) {
          clearInterval(refreshIntervalId);
          this.onTimeOut.emit();
        }
      }, 100);
  }
}
