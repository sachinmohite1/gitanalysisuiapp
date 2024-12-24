import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { RatingsComponent } from './ratings/ratings.component';
import { ReposComponent } from './repos/repos.component';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './service/auth.guard';
import { WalletsComponent } from './wallets/wallets.component'; 
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: "", 
    redirectTo: "/home", 
    pathMatch: 'full'
  },
  {
    path: "home", 
    component: HomeComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "ratings", component: RatingsComponent },
      { path: "repos", component: ReposComponent },
      { path: "wallets", component: WalletsComponent },
      { path: "profile", component: ProfileComponent}
    ]
  },
  /* Protected routes
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: "ratings",
    component: RatingsComponent,
    canActivate: [authGuard]
  },
  {
    path: "repos",
    component: ReposComponent,
    canActivate: [authGuard]
  },
  */
  // Auth callback route
  {
    path: "auth/callback",
    component: CallbackComponent
  },
  // Catch-all route
  {
    path: "**",
    redirectTo: "/home"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }