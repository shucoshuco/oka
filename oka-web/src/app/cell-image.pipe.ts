import { Pipe, PipeTransform } from '@angular/core';
import { Cell} from './Cell';

@Pipe({
  name: 'cellImage'
})
export class CellImagePipe implements PipeTransform {

  transform(cell: Cell, args?: any): any {
    return cell.oka
      ? '/assets/normal/striptease.png'
      : '/assets/normal/level-' + (cell.level + 1) + '.png';

  }

}
