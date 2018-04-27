import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-image-dice',
  templateUrl: './image-dice.component.html',
  styleUrls: ['./image-dice.component.scss']
})
export class ImageDiceComponent implements OnInit {

  @Input() spinClaz: string;

  @Input() asText: boolean;

  classStatus: string;

  _faces: string [];
  texts: string [];
  urls: string[];

  show: boolean;

  @Input() 
  set allFaces(faces: string []) {
    this._faces = [];
    this.urls = [];
    this.texts = [];
    if (faces) {
      faces.forEach(element => {
        this._faces.push(element);
        if (this.asText) {
          this.texts.push(element);
        } else {
          this.urls.push(element);
        }
      });
    }
  }

  get allFaces(): string[] {
    return this._faces;
  }

  @Input()
  set diceValue(value: number) {
    if (value >= 0) {
      this.classStatus = 'drop';
      setTimeout(() => {
        switch (value) {
          case 0: this.classStatus = 'front-selected'; break;
          case 1: this.classStatus = 'top-selected'; break;
          case 2: this.classStatus = 'right-selected'; break;
          case 3: this.classStatus = 'left-selected'; break;
          case 4: this.classStatus = 'bottom-selected'; break;
          case 5: this.classStatus = 'back-selected'; break;
        }
      }, 2000);
    } else {
      this.classStatus = 'rolling';
    }
  }

  get diceValue() {
    return 1;
  }

  ngOnInit() {
    this.classStatus = 'rolling';
    this._faces = [];
    this.urls = [];
    this.texts = [];
  }
}
