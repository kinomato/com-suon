import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public price: number;
  public ingredients: Ingredient[];
  public recipeid?: string;

  constructor(name: string, desc: string, imagePath: string, pri: number, ingredients: Ingredient[], id?: string) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.price = pri;
    this.ingredients = ingredients;
    this.recipeid = id;
  }
}
