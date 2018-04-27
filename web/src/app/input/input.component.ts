import { Component, OnInit, Input, Output, ViewChildren } from '@angular/core';
import { trigger, style, state, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  animations: [
    trigger('inputLabel', [
      state('non-selected', style({
        top: '15px',
        left: '5px',
        fontSize: '1.2em',
      })),
      state('selected', style({
        top: '-5px',
        left: '0px',
        fontSize: '1em',
      })),
      transition('non-selected <=> selected', animate('100ms')),
    ])
  ]

})
export class InputComponent implements OnInit {

  @ViewChildren('input') vc;
  
  @Input()
  text: string;

  @Input()
  type: string;

  value: string;

  state: string;
  spanClass: string;

  ngOnInit() {
    if (!this.type) {
      this.type = 'text';
    }
    this.reset();
  }

  select() {
    this.state = 'selected';
    this.spanClass = 'selected';
  }

  deselect() {
    console.log(this.value);
    if (!this.value || this.value === '') {
      this.state = 'non-selected';
    }
    this.spanClass = '';
  }

  clear() {
    this.value = '';
  }

  reset() {
    this.value = '';
    this.state = 'non-selected';
    this.spanClass = '';
  }

  focus() {
    this.vc.first.nativeElement.focus();
  }
}
