import { Component } from '@angular/core';
import {imagesPath} from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'OKAsutra';
  imagesPath = imagesPath;
}
