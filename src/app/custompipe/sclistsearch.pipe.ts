import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sclistsearch'
})
export class SclistsearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === null || args === undefined || args === '') {
      return value;
    }
    return value.filter((val: any) => {
      const rval = (val.bienso.toLocaleLowerCase().includes(args)) ||
        (val.tongtien.toString().includes(args)) ||
        /* (val.tenchuxe.toLocaleLowerCase().includes(args)) ||
        (val.bienso.toLocaleLowerCase().includes(args)) || */
        /* (val.diachi.toLocaleLowerCase().includes(args)) ||
        (val.dienthoai.toLocaleLowerCase().includes(args)) || */
        (val.ngaysuachua.day.toString().includes(args)) ||
        (val.ngaysuachua.month.toString().includes(args)) ||
        (val.ngaysuachua.year.toString().includes(args));
      return rval;
    });
  }

}
