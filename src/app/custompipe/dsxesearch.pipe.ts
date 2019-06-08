import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsxesearch'
})
export class DsxesearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === null || args === undefined || args === '') {
      return value;
    }
    return value.filter((val: any) => {
      const rval = (val.bienso.toLocaleLowerCase().includes(args)) ||
        (val.hieuxe.toLocaleLowerCase().includes(args)) ||
        (val.tenkhachhang.toLocaleLowerCase().includes(args)) ||
        (val.tienno.toString().includes(args));
      return rval;
    });
  }

}
