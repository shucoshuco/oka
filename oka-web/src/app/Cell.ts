import {Point} from './Point';
import {Rect} from './Rect';

export class Cell extends Rect{

  corner: boolean;
  rotation: number;
  position: number;

  oka: boolean;
  level: number;

  vertical: boolean;

  players: number[] = [];

  static halfCell(vertical: boolean, rect: Rect): Rect[] {
    return [
      new Rect(rect.top, rect.left,
                vertical ? rect.width : rect.width / 2,
                vertical ? rect.height / 2 : rect.height),
      new Rect(vertical ? rect.top + rect.height / 2 : rect.top,
                vertical ? rect.left : rect.left + rect.width / 2,
               vertical ? rect.width : rect.width / 2,
              vertical ? rect.height / 2 : rect.height),
    ];
  }

  static calculateCenter(rect: Rect): Point {
    return new Point((2 * rect.top + rect.height) / 2,
                     (2 * rect.left + rect.width) / 2);
  }

  static halfTriangleCell(tr: Rect) {
    return [
      {
        p1: new Point(tr.left, tr.top),
        p2: new Point(tr.left + tr.width / 2, tr.top + tr.height / 2),
        p3: new Point(tr.left, tr.top + tr.height),
      },
      {
        p1: new Point(tr.left + tr.width / 2, tr.top + tr.height / 2),
        p2: new Point(tr.left, tr.top + tr.height),
        p3: new Point(tr.left + tr.width, tr.top + tr.height),
      },
    ];
  }

  static calculateTriangleCenter(tr, cell: Cell) {
    let top = (tr.p1.y + tr.p2.y + tr.p3.y) / 3;
    let left = (tr.p1.x + tr.p2.x + tr.p3.x) / 3;

    const xCenter = cell.left + cell.width / 2;
    const yCenter = cell.top + cell.height / 2;
    for (let i = 0; i < cell.rotation; i++) {
      const aux = top;
      top = -(left - xCenter) + yCenter;
      left = aux - yCenter + xCenter;
    }
    return new Point(top, left);
  }

  innerRectangleCellOffset(nplayers: number): Point[] {
    if (nplayers === 1) {
      return [Cell.calculateCenter(this)];
    }
    const rects = Cell.halfCell(this.vertical, this);
    if (nplayers === 2) {
      return [
        Cell.calculateCenter(rects[0]),
        Cell.calculateCenter(rects[1]),
      ];
    }
    const rects2 = Cell.halfCell(!this.vertical, rects[1]);
    if (nplayers === 3) {
      return [
        Cell.calculateCenter(rects[0]),
        Cell.calculateCenter(rects2[0]),
        Cell.calculateCenter(rects2[1]),
      ];
    }
    const rects4 = Cell.halfCell(this.vertical, rects[0]);
    return [
      Cell.calculateCenter(rects4[0]),
      Cell.calculateCenter(rects4[1]),
      Cell.calculateCenter(rects2[0]),
      Cell.calculateCenter(rects2[1]),
    ];
  }

  innerTriangleCellOffset(nplayers: number): Point[] {
    const tr = {
      p1: {x: this.left, y: this.top},
      p2: {x: this.left + this.width, y: this.top + this.height},
      p3: {x: this.left, y: this.top + this.height},
    };
    if (nplayers === 1) {
      return [Cell.calculateTriangleCenter(tr, this)];
    }
    const trs = Cell.halfTriangleCell(this);
    if (nplayers === 2) {
      return [
        Cell.calculateTriangleCenter(trs[0], this),
        Cell.calculateTriangleCenter(trs[1], this),
      ];
    }
    // TODO Add more players to corner cells
  }

  innerCellOffset(): Point[] {
    return this.corner
        ? this.innerTriangleCellOffset(this.players.length)
        : this.innerRectangleCellOffset(this.players.length);
  }
}
