import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NewListComponent } from './new-list/new-list.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const AppRoutes: Routes = [
  { path: '', redirectTo: '/lists', pathMatch: 'full' },
  { path: 'lists', component: MainContainerComponent },
  { path: 'lists/:listId', component: MainContainerComponent },
  
  { path: 'new-list', component: NewListComponent },
  { path: 'new-task/:listId', component: NewTaskComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
]
@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    NewListComponent,
    NewTaskComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
