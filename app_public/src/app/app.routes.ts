import { Routes } from '@angular/router';
import { HomePage } from './pages/home.page';
import { DashboardPage } from './pages/dashboard.page';
import { DebateDetailPage } from './pages/debate-detail.page';
import { CreateDebatePage } from './pages/create-debate.page';
import { LoginPage } from './pages/login.page';
import { SignupPage } from './pages/signup.page';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardPage, canActivate: [AuthGuard] },
  { path: 'debates/:id', component: DebateDetailPage, canActivate: [AuthGuard] },
  { path: 'create', component: CreateDebatePage, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignupPage },
  { path: '**', redirectTo: '' }
];
