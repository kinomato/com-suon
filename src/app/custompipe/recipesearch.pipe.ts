import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recipesearch'
})
export class RecipesearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === null || args === undefined || args === '') {
      return value;
    }
    return value.filter((val: any) => {
      const rval = (val.name.toLocaleLowerCase().includes(args)) ||
         (val.description.toLocaleLowerCase().includes(args));
      return rval;
    });
  }

}
