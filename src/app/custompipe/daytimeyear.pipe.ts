import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customdatetime'
})
export class DaytimeyearPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return 'NaN';
    }
    const day = value.day;
    const month = value.month;
    const year = value.year;
    return day + '/' + month + '/' + year as string;
  }

}
