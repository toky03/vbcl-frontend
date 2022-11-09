import { Pipe, PipeTransform } from '@angular/core';
import { prettyFormat } from 'src/app/utils/date-utils';

@Pipe({
  name: 'vbcDate'
})
export class VbcDatePipe implements PipeTransform {

  transform(inputDate: string): string {
    if(!inputDate){
      return '';
    }
    return  prettyFormat(inputDate);
  }

}
