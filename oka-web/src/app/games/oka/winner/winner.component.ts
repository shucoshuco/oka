import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {

  @Output() onClose: EventEmitter<void> = new EventEmitter();
  _winner: string;
  show: boolean;

  @Input()
  set winner(winner: string) {
    this._winner = winner;
    this.show = winner !== undefined;
  }

  get winner() {
    return this._winner;
  }

  constructor() { }

  ngOnInit() {
    this.show = false;
    this._winner = undefined;
  }

  close() {
    this.onClose.emit();
  }

}
