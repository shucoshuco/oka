import {Gender} from './Gender';
import {Point} from './Point';

export class Player {
  ordinal: number;
  name: string;
  alias: string;
  gender: Gender;
  nitems: number;
  position: number;
  turn: boolean;

  coords: Point;
}
