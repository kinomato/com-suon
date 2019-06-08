import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy{
  recipe: Recipe;
  subscription: Subscription;
  id: string;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    /* this.getRecipe(); */
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params.id;
          this.subscription = this.recipeService.getRecipe(this.id).subscribe(rec => {
            this.recipe = rec;
          });
        }
      );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
  getRecipe() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    this.recipeService.getRecipe(this.id).subscribe(res => {
      this.recipe = res;
    });
  }
  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
