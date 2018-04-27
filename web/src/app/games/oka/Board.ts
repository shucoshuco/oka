import {Cell} from './Cell';

export class Board {
  parameters: object;
  cells: Cell[];
  lastCell: Cell;

  constructor(parameters: object, cells: Cell[], lastCell: Cell) {
    this.parameters = parameters;
    this.cells = cells;
    this.lastCell = lastCell;
  }
}
