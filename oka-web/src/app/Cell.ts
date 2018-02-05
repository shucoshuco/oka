export class Cell {

  corner: boolean;
  rotation: number;
  position: number;

  width: number;
  height: number;
  top: number;
  left: number;

  oka: boolean;
  level: number;

  vertical: boolean;

  static halfCell(vertical, rect) {
    return [
      {
        top: rect.top,
        left: rect.left,
        width: vertical ? rect.width : rect.width / 2,
        height: vertical ? rect.height / 2 : rect.height,
      },
      {
        top: vertical ? rect.top + rect.height / 2 : rect.top,
        left: vertical ? rect.left : rect.left + rect.width / 2,
        width: vertical ? rect.width : rect.width / 2,
        height: vertical ? rect.height / 2 : rect.height,
      },
    ];
  }

  static calculateCenter(rect) {
    return {
      top: (2 * rect.top + rect.height) / 2,
      left: (2 * rect.left + rect.width) / 2,
    };
  }

  static halfTriangleCell(tr) {
    return [
      {
        p1: {x: tr.left, y: tr.top},
        p2: {x: tr.left + tr.width / 2, y: tr.top + tr.height / 2},
        p3: {x: tr.left, y: tr.top + tr.height},
      },
      {
        p1: {x: tr.left + tr.width / 2, y: tr.top + tr.height / 2},
        p2: {x: tr.left, y: tr.top + tr.height},
        p3: {x: tr.left + tr.width, y: tr.top + tr.height},
      },
    ];
  }

  static calculateTriangleCenter(tr, cell) {
    let top = (tr.p1.y + tr.p2.y + tr.p3.y) / 3;
    let left = (tr.p1.x + tr.p2.x + tr.p3.x) / 3;

    const xCenter = cell.left + cell.width / 2;
    const yCenter = cell.top + cell.height / 2;
    for (let i = 0; i < cell.rotation; i++) {
      const aux = top;
      top = -(left - xCenter) + yCenter;
      left = aux - yCenter + xCenter;
    }
    return {
      top: top,
      left: left,
    };
  }

  innerRectangleCellOffset(nplayers: number) {
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

  innerTriangleCellOffset(nplayers: number) {
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

  innerCellOffset(nplayers: number) {
    return this.corner
        ? this.innerTriangleCellOffset(nplayers)
        : this.innerRectangleCellOffset(nplayers);
  }
}
