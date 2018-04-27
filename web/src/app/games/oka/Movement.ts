export class Movement {

  dice: number;
  end: boolean;
  turn: number;
  nextTurn: number;
  from: number;
  to: number;
  jumpInfo: Movement;

  winner: number;
  nitems: number;

  hasJump() {
    return this.jumpInfo;
  }
}
