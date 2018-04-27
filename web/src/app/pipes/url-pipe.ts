import { Pipe, PipeTransform } from '@angular/core';
import { imagesPath } from '../globals';

@Pipe({
  name: 'urlCss'
})
export class UrlCssPipe implements PipeTransform {

  transform(url: string, args?: any): any {
    return 'url(' + imagesPath + url + ')';
  }

}
