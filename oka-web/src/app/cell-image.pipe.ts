import { Pipe, PipeTransform } from '@angular/core';
import { Cell} from './Cell';
import { imagesPath } from './globals';

@Pipe({
  name: 'cellImage'
})
export class CellImagePipe implements PipeTransform {

  transform(cell: Cell, args?: any): any {
    return cell.oka
      ? imagesPath + 'striptease.png'
      : imagesPath + 'level-' + (cell.level + 1) + '.png';
  }

}
