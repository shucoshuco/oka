import {Cell} from './Cell';
import { Status } from './Status';

export class Game {

  id: string;
  status: Status;
  board: Cell[];
}
