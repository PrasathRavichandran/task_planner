import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NewListComponent } from './new-list/new-list.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const AppRoutes: Routes = [
  { path: '', component: MainContainerComponent },
  { path: 'new-list', component: NewListComponent },
  { path: 'new-task', component: NewTaskComponent },
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
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
