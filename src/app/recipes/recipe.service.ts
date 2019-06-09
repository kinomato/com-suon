import { Injectable, EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class RecipeService {
  recipesChanged = new EventEmitter<Recipe[]>();

  /* private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]),
    new Recipe('Big Fat Burger',
      'What else you need to say?',
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1)
      ])
  ]; */

  constructor(
    private slService: ShoppingListService,
    private fireStore: AngularFirestore) { }

  getRecipes() {
    /* return this.recipes.slice(); */
    return this.fireStore.collection<Recipe>('com').snapshotChanges();
  }

  getRecipe(id?: string) {
    /* return this.recipes[index]; */
    return this.fireStore.collection('com').doc<Recipe>(id).valueChanges();
  }
  setRecipes(recipes: Recipe[]) {
   /*  this.recipes = recipes;
    this.recipesChanged.emit(this.recipes.slice()); */
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    /* this.recipes.push(recipe);
    this.recipesChanged.emit(this.recipes.slice()); */
    return this.fireStore.collection('com').add(recipe);
  }

  updateRecipe(index: string, newRecipe: Recipe) {
    /* this.recipes[index] = newRecipe;
    this.recipesChanged.emit(this.recipes.slice()); */
    return this.fireStore.collection('com').doc(index).update(newRecipe);
  }

  deleteRecipe(index: string) {
    /* this.recipes.splice(index, 1); */
    this.fireStore.collection('com').doc(index).delete();
    /* this.recipesChanged.emit(this.recipes.slice()); */
  }
}
