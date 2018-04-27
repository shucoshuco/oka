import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Cell } from '../Cell';
import { CellImagePipe } from '../cell-image.pipe';

@Component({
  selector: 'app-board-corner-cell',
  templateUrl: './board-corner-cell.component.html',
  styleUrls: ['./board-corner-cell.component.scss']
})
export class BoardCornerCellComponent implements OnInit {

  @Input() cell: Cell;
  image: any;

  constructor(private element: ElementRef, private cellImagePipe: CellImagePipe) {
  }

  ngOnInit() {
    this.image = document.createElement('img');
    this.image.src = this.cellImagePipe.transform(this.cell);
    this.image.onload = this.draw.bind(this);
  }

  draw() {
    const c = this.element.nativeElement.children[0].children[0];
    const size = Math.max(this.cell.width, this.cell.height);
    c.width = size;
    c.height = size;
    const context = c.getContext('2d');
    context.clearRect(0, 0, size, size);
    const radius = size / 2;
    const cPoints = [
      {x: -radius, y: -radius},
      {x: -radius, y: radius},
      {x: radius, y: radius},
      {x: -radius + 2, y: -radius + 9},
      {x: -radius + 2, y: radius - 9},
      {x: -radius + 2, y: radius - 2},
      {x: -radius + 9, y: radius - 2},
      {x: radius - 9, y: radius - 2},
      {x: radius - 4, y: radius - 2},
      {x: radius - 9, y: radius - 5},
      {x: -radius + 5, y: -radius + 9},
      {x: -radius + 2, y: -radius + 4},
    ];

    for (let i = 0; i < this.cell.rotation; i++) {
      for (let j = 0; j < cPoints.length; j++) {
        cPoints[j] = {x: cPoints[j].y, y: -cPoints[j].x};
      }
    }

    for (let i = 0; i < cPoints.length; i++) {
      cPoints[i] = {
        x: cPoints[i].x + radius,
        y: cPoints[i].y + radius,
      };
    }

    const levels = [
      '#000000', '#ECF8E0', '#FFDAD9',
      '#FF6D69', '#CC5754', '#AC1D1E',
    ];

    context.beginPath();
    context.moveTo(cPoints[0].x, cPoints[0].y);
    context.lineTo(cPoints[1].x, cPoints[1].y);
    context.lineTo(cPoints[2].x, cPoints[2].y);
    context.closePath();

    context.save();
    context.beginPath();
    context.moveTo(cPoints[3].x, cPoints[3].y);
    context.lineTo(cPoints[4].x, cPoints[4].y);
    context.quadraticCurveTo(cPoints[5].x, cPoints[5].y,
      cPoints[6].x, cPoints[6].y);
    context.lineTo(cPoints[7].x, cPoints[7].y);
    context.quadraticCurveTo(cPoints[8].x, cPoints[8].y,
      cPoints[9].x, cPoints[9].y);
    context.lineTo(cPoints[10].x, cPoints[10].y);
    context.quadraticCurveTo(cPoints[11].x, cPoints[11].y,
      cPoints[3].x, cPoints[3].y);
    context.closePath();
    const levelIndex = this.cell.oka ? 0 : this.cell.level + 1;
    context.fillStyle = levels[levelIndex];
    context.fill();
    context.clip();

    context.drawImage(this.image, 0, 0, size, size);
  }
}
