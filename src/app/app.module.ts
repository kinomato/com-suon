import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NumericTextboxModule } from 'ngx-numeric-textbox';

import { OrderModule } from 'ngx-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';

import {
  MatAutocompleteModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule
} from '@angular/material';
import { DaytimeyearPipe } from './custompipe/daytimeyear.pipe';
import { TnlistsearchPipe } from './custompipe/tnlistsearch.pipe';
import { TtlistsearchPipe } from './custompipe/ttlistsearch.pipe';
import { LoginFormComponent } from './users/login-form/login-form.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { DatastorageService } from './shared/datastorage.service';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    RecipeStartComponent,
    RecipeEditComponent,
    DaytimeyearPipe,
    TnlistsearchPipe,
    TtlistsearchPipe,
    LoginFormComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    /* FormControl, */
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(), // cho phép hoạt động offline
    AngularFireStorageModule,
    AppRoutingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgbModule,
    NgbDatepickerModule,
    SelectDropDownModule,
    NumericTextboxModule,
    MatPaginatorModule,
    MatProgressBarModule,
    OrderModule,
    NgxPaginationModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
  ],
  exports: [
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NgbDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule
  ],
  providers: [ShoppingListService, RecipeService, DatastorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
