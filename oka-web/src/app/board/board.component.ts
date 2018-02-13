import {Component, ElementRef, OnInit} from '@angular/core';
import {GameApiService} from '../game-api.service';
import {Player} from '../Player';
import {Cell} from '../Cell';
import {Board} from '../Board';
import {Point} from '../Point';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  gameId: string;

  loading: boolean;
  errorLoading: boolean;
  timeoutId: number;

  board: Board;
  turn: number;
  players: Player[];

  movement: any;
  advance: number;
  minWidth: number;

  constructor(private gameApi: GameApiService) {
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

  initializeMovement(board, players) {
    let moving = false;
    const speed = 'fast';
    const speeds = {'slow': 800, 'medium': 570, 'fast': 350};

    const updateCellPositions = function(cell) {
      if (cell.players) {
        // const positions = cell.innerCellOffset(cell.players.length, cell);
        // for (let i = 0; i < cell.players.length; i++) {
        //   cell.players[i].boardPosition = cell.position;
        //   cell.players[i].top = positions[i].top;
        //   cell.players[i].left = positions[i].left;
        // }
      }
    };

    const moveToPosition = function(player, position, callback) {
      moving = true;

      if (position === 0) {
        clearInterval(this.timeoutId);
        moving = false;
        callback();
        return;
      }

      const currentCell = player.boardPosition;
      const nextCell = currentCell + 1;
      if (nextCell >= board.cells.length) {
        clearInterval(this.timeoutId);
        moving = false;
        return;
      }

      let cell = board.cells[nextCell];
      cell.players = cell.players || [];
      cell.players.push(player);
      updateCellPositions(cell);

      cell = board.cells[currentCell];
      const index = cell.players.indexOf(player);
      if (index > -1) {
        cell.players.splice(index, 1);
        updateCellPositions(cell);
      }

      this.timeoutId = setInterval(function() {
        moveToPosition(player, position - 1, callback);
      }, speeds[speed]);
    };


    return {
      speed: speed,
      refresh: function() {
        board.cells.forEach(function(cell) {
          updateCellPositions(cell);
        });
      },
      advance: function(mov) {
        this.status.rolling = false;
        if (!moving) {
          const currentPosition = this.players[mov.turn].boardPosition;
          const cellsToMove =
            (mov.jump ? mov.jumpInfo.to : mov.to) - currentPosition;
          moveToPosition(
            this.players[mov.turn],
            cellsToMove,
            function() {
              this.board.cells[mov.player.position].selected = true;
            }
          );
          this.lastMovement = mov;
        }
      },
      updateCellPositions: updateCellPositions,
    };
  }

  nextTurn(ev) {
    alert(ev.target.value);
    const changeTurn = function () {
      this.players.forEach(function (p) {
        p.turn = false;
      });
      this.players[this.lastMovement.turn].model
        = this.lastMovement.player;
      this.status = this.lastMovement.status;
      const nextTurn = this.status.turn;
      this.players[nextTurn].turn = true;
      this.players[nextTurn].model =
        this.status.players[nextTurn];
      this.status.rolling = true;
    };
    // if (this.lastMovement && this.lastMovement.jump) {
    //   moveToPosition(
    //     this.players[this.lastMovement.turn],
    //     this.lastMovement.to - this.lastMovement.jumpInfo.to,
    //     changeTurn
    //   );
    // } else {
    //   changeTurn();
    // }
  }

  move(ev) {
    alert(ev);
  }

  rollDice() {

  }

  calculatePlayerPositions(player: Player, cell: Cell) {
    const boardElement = document.getElementById('board');
    if (boardElement) {
      const positions = cell.innerCellOffset();
      for (let i = 0; i < cell.players.length; i++) {
        if (cell.players[i] === player.ordinal) {
          player.coords = positions[i];
          player.coords.x += boardElement.offsetLeft;
          player.coords.y += boardElement.offsetTop;
        }
      }
    } else {
      player.coords = new Point();
    }
  }

  start() {
    this.players.forEach(p => this.calculatePlayerPositions(p, this.board.cells[0]));
  }

  ngOnInit() {

    this.loading = true;

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

      this.movement = this.initializeMovement(this.board, this.players);
      this.advance = this.movement.advance;
      this.nextTurn = this.movement.nextTurn;
      this.loading = false;
      this.minWidth = this.board.parameters['width'];

      setTimeout(this.start.bind(this), 2000);
    });
  }
}
