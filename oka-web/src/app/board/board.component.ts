import {Component, ElementRef, OnInit} from '@angular/core';
import {GameApiService} from '../game-api.service';
import {Player} from '../Player';
import {Cell} from '../Cell';
import {Board} from '../Board';
import {Point} from '../Point';
import {Movement} from '../Movement';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  offsetX: number;
  offsetY: number;

  gameId: string;

  status: string;

  board: Board;
  turn: number;
  players: Player[];
  playerTurnName: string;

  minWidth: number;

  movement: Movement;

  speed = 'fast';
  speeds = {'slow': 800, 'medium': 570, 'fast': 350};

  currentCellDetail: Cell;
  currentNItems: number;

  winner: string;

  constructor(private gameApi: GameApiService) {}

  static emptyBoard() {
    return new Board({}, [], new Cell());
  }

  static initialWidth() {
    let initialWidth = Math.min(screen.width * 0.7, screen.height * 0.9);
    initialWidth = Math.max(initialWidth, 340);
    return initialWidth - initialWidth * 0.05;
  }

  static calculateBoardParameters(initialWidth: number, ncells: number) {
    const n1stCell = Math.floor(ncells / 15);
    const virtualCells = ncells + n1stCell + Math.floor(ncells / 10);

    // b^2 = w * h * n
    // h = 2w
    // b^2 = 2w^2 * n
    // w = sqrt(b^2/(2 * n)

    const cellWidth =
      Math.floor(
        Math.sqrt(
          Math.pow(initialWidth, 2) / (2 * virtualCells)));

    const cellHeight = 2 * cellWidth;

    const actualWidth = Math.sqrt(cellWidth * cellHeight * virtualCells);

    const nside = Math.ceil(actualWidth / cellWidth);

    const finalWidth = nside * cellWidth;

    return {
      width: finalWidth,
      n1stCell: n1stCell,
      cellWidth: cellWidth,
      cellHeight: cellHeight,
      nside: nside,
      fontSize: finalWidth * 0.7 / 600,
      left: Math.max(initialWidth - finalWidth, 0) / 2,
    };
  }

  static calculateState(cellWidth: number, cellHeight: number) {
    return {
      current: -1,
      values: [
        {
          movement: {x: 1, y: 0},
          size: {width: cellWidth, height: cellHeight},
          fixLast: {x: 0, y: 0},
          fixNext: {x: 0, y: -1},
          gap: 2,
          vertical: true,
        },
        {
          movement: {x: 0, y: -1},
          size: {width: cellHeight, height: cellWidth},
          fixLast: {x: 0, y: -1},
          fixNext: {x: -1, y: 0},
          gap: 0,
          vertical: false,
        },
        {
          movement: {x: -1, y: 0},
          size: {width: cellWidth, height: cellHeight},
          fixLast: {x: -1, y: 0},
          fixNext: {x: 0, y: 2},
          gap: 2,
          vertical: true,
        },
        {
          movement: {x: 0, y: 1},
          size: {width: cellHeight, height: cellWidth},
          fixLast: {x: 0, y: 0},
          fixNext: {x: 2, y: 0},
          gap: 0,
          vertical: false,
        },
      ],
      next: function() {
        this.current++;
        if (this.current > 3) {
          this.current = 0;
        }
        return this.values[this.current];
      },
    };
  }

  static updateBoard(cells: Cell[], lastCell: Cell, boardParameters) {
    let top = boardParameters.width - boardParameters.cellHeight;
    let left = 0;

    cells[0].top = top;
    cells[0].left = left;
    cells[0].vertical = false;
    cells[0].width = boardParameters.cellWidth * boardParameters.n1stCell;
    cells[0].height = boardParameters.cellHeight - 4;

    let perSide = boardParameters.nside;
    left += boardParameters.n1stCell * boardParameters.cellWidth;

    const state = BoardComponent.calculateState(
      boardParameters.cellWidth,
      boardParameters.cellHeight
    );
    let step = state.next();
    let offset = boardParameters.n1stCell;

    lastCell.width = boardParameters.width;
    lastCell.height = boardParameters.width;

    for (let i = 1; i < cells.length; ) {
      while (offset++ < perSide && i < cells.length) {
        if (offset === perSide - 1) {
          top += step.fixLast.y * boardParameters.cellWidth;
          left += step.fixLast.x * boardParameters.cellWidth;
        }

        cells[i].top = top;
        cells[i].left = left;
        cells[i].vertical = step.vertical;

        cells[i].corner = false;
        if (offset >= perSide - 1) {
          cells[i].corner = true;
          cells[i].rotation = offset === perSide - 1
            ? state.current : state.current + 2;
          cells[i].width = boardParameters.cellHeight;
          cells[i].height = boardParameters.cellHeight;
        } else {
          cells[i].width = step.size.width;
          cells[i].height = step.size.height - 4;
          top += step.movement.y * boardParameters.cellWidth;
          left += step.movement.x * boardParameters.cellWidth;
        }
        i++;
      }
      if (i < cells.length) {
        perSide -= step.gap;
        top += step.fixNext.y * boardParameters.cellWidth;
        left += step.fixNext.x * boardParameters.cellWidth;
        step = state.next();
        offset = 0;
        if (state.current === 0) {
          lastCell.left = left;
          lastCell.width -= boardParameters.cellHeight;
        }
        if (state.current === 1) {
          lastCell.height -= boardParameters.cellHeight;
        }
        if (state.current === 2) {
          lastCell.width -= boardParameters.cellHeight;
        }
        if (state.current === 3) {
          lastCell.top = top;
          lastCell.height -= boardParameters.cellHeight;
        }
      }
    }
  }

  static createBoard(initialWidth, cellsRaw): Board {
    const boardParameters =
      BoardComponent.calculateBoardParameters(initialWidth, cellsRaw.length);

    const cells: Cell[] = [];

    cellsRaw.forEach(c => {
      const cell = new Cell();
      Object.assign(cell, c);
      cell.level = c.oka ? 0 : c.level;
      cells.push(cell);
    });

    const lastCell = new Cell();
    BoardComponent.updateBoard(cells, lastCell, boardParameters);

    return new Board(boardParameters, cells, lastCell);
  }

  onResize(event) {
    const boardElement = document.getElementById('board');
    this.offsetX = boardElement.offsetLeft;
    this.offsetY = boardElement.offsetTop;
    this.players.forEach(p => this.updateCellPositions(this.board.cells[p.position]));
  }

  changeStatus(status) {
    console.log('Status changed from ' + this.status + ' to ' + status);
    this.status = status;
  }

  changeTurn() {
    if (this.movement.nitems) {
      this.players[this.turn].nitems -= this.movement.nitems;
      console.log('Player items: ' + this.players[this.turn].nitems);
    }
    this.turn = this.movement.nextTurn;
    this.players.forEach((p, idx) => {
      p.turn = idx === this.turn;
    });
    this.playerTurnName = this.players[this.turn].name;
    this.changeStatus('rolling');
    this.currentCellDetail = null;
    this.currentNItems = null;
  }

  updateCellPositions(cell: Cell) {
    if (cell.players) {
      const positions = cell.innerCellOffset();
      for (let i = 0; i < cell.players.length; i++) {
        const player: Player = this.players[cell.players[i]];
        player.position = cell.position;
        player.coords.x = positions[i].x;
        player.coords.y = positions[i].y;
      }
    }
  }

  jumpToCell(player: Player, cellToJump: number) {
    const currentCell = player.position;
    if (currentCell === cellToJump) {
      return;
    }
    player.position = cellToJump;

    let cell = cellToJump >= this.board.cells.length
      ? this.board.lastCell :  this.board.cells[cellToJump];
    cell.players = cell.players || [];
    cell.players.push(player.ordinal);
    this.calculateCellPositions(cell);

    cell = this.board.cells[currentCell];
    const index = cell.players.indexOf(player.ordinal);
    if (index > -1) {
      cell.players.splice(index, 1);
      this.calculateCellPositions(cell);
    }
  }

  moveToPosition(player: Player, cellsToMove: number, callback) {
    if (cellsToMove === 0) {
      callback();
      return;
    }

    const currentCell = player.position;
    const nextCell = currentCell + 1;

    this.jumpToCell(player, nextCell);

    if (nextCell < this.board.cells.length) {
      setTimeout(() => {
          this.moveToPosition(player, cellsToMove - 1, callback);
      }, this.speeds[this.speed]);
    } else {
      callback();
    }
  }

  onRolled(movement: Movement) {
    this.changeStatus('moving');
    this.movement = movement;
    const player = this.players[movement.turn];
    const cellsToMove = movement.to - player.position;
    if (cellsToMove > 0) {
      this.moveToPosition(
        player,
        cellsToMove,
        movement.end
          ? () => {
            this.changeStatus('finished');
            this.winner = player.name;
          }
          : () => {
            this.changeStatus('showCellDetails');
            this.currentCellDetail = this.board.cells[movement.to];
            this.currentNItems = player.nitems;
          }
      );
    } else {
      this.changeTurn();
    }
  }

  actionCompleted() {
    this.currentCellDetail = null;
    this.currentNItems = null;
    let timeout = 500;
    if (this.movement.hasJump()) {
      this.changeStatus('moving');
      this.jumpToCell(this.players[this.movement.turn], this.movement.jumpInfo.to);
      timeout = 1000;
    }
    setTimeout(this.changeTurn.bind(this), timeout);
  }

  calculateCellPositions(cell: Cell) {
    const positions = cell.innerCellOffset();
    for (let i = 0; i < cell.players.length; i++) {
      const player = this.players[cell.players[i]];
      player.coords.y = positions[i].y;
      player.coords.x = positions[i].x;
      console.log('Player coords: ' + player.coords.x + ' - ' + player.coords.y);
    }
  }

  start(point: Point) {
    const boardElement = document.getElementById('board');
    this.offsetX = boardElement.offsetLeft;
    this.offsetY = boardElement.offsetTop;
    this.calculateCellPositions(this.board.cells[0]);
    setTimeout(this.changeTurn.bind(this), 1000);
  }

  ngOnInit() {

    this.offsetX = this.offsetY = null;
    this.gameId = null;
  
    this.board = null;
    this.turn = null;
    this.players = null;
    this.playerTurnName = null;
  
    this.movement = null;
  
    this.currentCellDetail = null;
    this.currentNItems = null;
  
    this.winner = null;

    this.changeStatus('loading');
    this.board = BoardComponent.emptyBoard();

    this.gameApi.getBoard().subscribe((game) => {
      this.gameId = game['id'];
      this.turn = game['status']['turn'];

      this.board = BoardComponent.createBoard(BoardComponent.initialWidth(), game['board']);

      const cell0 = this.board.cells[0];
      this.players = [];
      game['status']['players'].forEach((p, idx) => {
        const player: Player = new Player();
        player.ordinal = idx;
        player.coords = new Point();
        Object.assign(player, p);
        this.players.push(player);
        cell0.players.push(idx);
      });

      this.movement = new Movement();
      this.movement.nextTurn = 0;
      this.changeStatus('starting');
      this.minWidth = this.board.parameters['width'];

      setTimeout(this.start.bind(this), 2000);
    });
  }
}
