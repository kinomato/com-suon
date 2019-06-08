import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ttlistsearch'
})
export class TtlistsearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === null || args === undefined || args === '') {
      return value;
    }
    return value.filter((val: any) => {
      const rval = (val.bienso.toLocaleLowerCase().includes(args)) ||
        (val.sotienthu.toString().includes(args)) ||
        (val.tenchuxe.toLocaleLowerCase().includes(args)) ||
        (val.bienso.toLocaleLowerCase().includes(args)) ||
        (val.diachi.toLocaleLowerCase().includes(args)) ||
        (val.dienthoai.toLocaleLowerCase().includes(args)) ||
        (val.ngaythutien.day.toString().includes(args)) ||
        (val.ngaythutien.month.toString().includes(args)) ||
        (val.ngaythutien.year.toString().includes(args));
      return rval;
    });
  }

}
