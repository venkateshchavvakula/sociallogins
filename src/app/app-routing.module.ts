import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { LoginSuccessComponent } from './login-success/login-success.component';


const routes: Routes = [
  { path: '', component: LoginSignupComponent },
  { path: 'home', component: LoginSuccessComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
