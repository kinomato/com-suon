import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* import { RecipeService } from 'app/recipes/recipe.service'; */
/* import { Response } from '@angular/http'; */
/* import { Recipe } from 'app/recipes/recipe.model'; */
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable()
export class DatastorageService {

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService) { }
  saveDataToFirebase() {
    this.httpClient.put('https://da1-shopping.firebaseio.com/recipes.json', this.recipeService.getRecipes())
      .subscribe(
        (Response) => {
          console.log('response: ' + Response);
        }
      );
  }
  getDataFromFirebase() {
    this.httpClient.get('https://da1-shopping.firebaseio.com/recipes.json')
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
}
