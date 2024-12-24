// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

// Other Modules
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Components
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RatingsComponent } from './ratings/ratings.component';
import { ReposComponent } from './repos/repos.component';
import { SigninComponent } from './signin/signin.component';
import { CallbackComponent } from './callback/callback.component';
import { TrustScoreModule } from './trust-score/trust-score.module';
import { WalletsComponent } from './wallets/wallets.component';
import { ProfileComponent } from './profile/profile.component';

// Services
import { GithubUserService } from './service/github-user.service';
import { GithubRepoService } from './service/github-repo.service';
import { GithubProfileService } from './service/github-profile.service';

@NgModule({
  declarations: [
    AppComponent,
    RatingsComponent,
    ReposComponent,
    SigninComponent,
    WalletsComponent,
    ProfileComponent // Add this
  ],
  imports: [
    // Core Modules
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    // Material Modules
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatProgressBarModule,
    MatSortModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,

    // Feature Modules
    NgxChartsModule,
    TrustScoreModule,

    // Standalone Components
    HomeComponent,
    DashboardComponent,
    CallbackComponent
  ],
  providers: [
    GithubUserService,
    GithubRepoService,
    GithubProfileService // Add this
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }