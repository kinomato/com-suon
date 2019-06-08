import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tnlistsearch'
})
export class TnlistsearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === null || args === undefined || args === '') {
      return value;
    }
    return value.filter((val: any) => {
      const rval = (val.bienso.toLocaleLowerCase().includes(args)) ||
        (val.hieuxe.toLocaleLowerCase().includes(args)) ||
        (val.tenkhachhang.toLocaleLowerCase().includes(args)) ||
        (val.bienso.toLocaleLowerCase().includes(args)) ||
        (val.diachi.toLocaleLowerCase().includes(args)) ||
        (val.dienthoai.toLocaleLowerCase().includes(args)) ||
        (val.ngaytiepnhan.day.toString().includes(args)) ||
        (val.ngaytiepnhan.month.toString().includes(args)) ||
        (val.ngaytiepnhan.year.toString().includes(args));
      return rval;
    });
  }

}
