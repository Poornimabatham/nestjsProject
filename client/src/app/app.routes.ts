import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { Login } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { 
    path: 'signup', 
    component: SignupComponent 
  },
  { 
    path: 'login', 
    component: Login 
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
