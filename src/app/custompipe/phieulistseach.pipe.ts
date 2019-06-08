import { Pipe, PipeTransform } from '@angular/core';
import { Phieufilter } from '../interfaces/phieufilter';

@Pipe({
  name: 'phieulistseach'
})
export class PhieulistseachPipe implements PipeTransform {

  transform(value: Phieufilter[], args?: any): any {
    if (args === null || args === undefined || args === '') {
      return value;
    }
    if (args === 'tiepnhan') {
      return value.filter((val: any) => {
        const rval = (val.type.tiepnhan === true);
        return rval;
      });
    }
    if (args === 'suachua') {
      return value.filter((val: any) => {
        const rval = (val.type.suachua === true);
        return rval;
      });
    }
    if (args === 'thutien') {
      return value.filter((val: any) => {
        const rval = (val.type.thutien === true);
        return rval;
      });
    }
  }

}
