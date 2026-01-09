import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { SignupComponent } from './presentation/pages/signup/signup.component';
import { LoginComponent } from './presentation/pages/login/login.component';
import { ForgotPasswordComponent } from './presentation/pages/forgot-password/forgot-password.component';
import { HomePageModule } from './presentation/components/home/home-page.module';

const routes: Routes = [
  {
    path: 'home-page',
    loadChildren: () =>
      import('./presentation/components/home/home-page.module').then(m => m.HomePageModule),
  },
  { path: 'login', component: LoginComponent },

 
  // {
  //   path: 'home-page',
  //   loadChildren: () =>
  //     import('./presentation/components/home/home-page.module').then(m => m.HomePageModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  // { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', redirectTo: '/login' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
