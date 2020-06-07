import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NewListComponent } from './new-list/new-list.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UpdateListTaskComponent } from './update-list-task/update-list-task.component';
import { WebReqInterceptor } from './services/web-req.interceptor.service';

const AppRoutes: Routes = [
  { path: '', redirectTo: '/lists', pathMatch: 'full' },
  { path: 'lists', component: MainContainerComponent },
  { path: 'lists/:listId', component: MainContainerComponent },

  { path: 'new-list', component: NewListComponent },
  { path: 'new-task/:listId', component: NewTaskComponent },

  { path: 'update-task/:status/:listId/:taskId', component: UpdateListTaskComponent },
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
    SignupComponent,
    UpdateListTaskComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
