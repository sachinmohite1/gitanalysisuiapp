import { Component, OnInit, OnDestroy } from '@angular/core';
import { GithubProfileService } from '../service/github-profile.service';
import { AuthService } from '../service/auth.service';
import { GithubProfile } from '../models/github-profile.model';
import { Subject } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: GithubProfile | null = null;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private profileService: GithubProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = '';
    
    console.log('[ProfileComponent] Starting profile load');
    
    this.authService.currentUser
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('[ProfileComponent] Auth service error:', error);
          this.error = 'Failed to authenticate user';
          throw error;
        })
      )
      .subscribe({
        next: (user) => {
          const username = user?.user_metadata?.['user_name'];
          console.log('[ProfileComponent] Current user:', { user, username });

          if (!username) {
            this.error = 'Username not found in user metadata';
            this.loading = false;
            return;
          }

          this.profileService.getProfile(username)
            .pipe(
              takeUntil(this.destroy$),
              finalize(() => {
                this.loading = false;
                console.log('[ProfileComponent] Profile load completed');
              })
            )
            .subscribe({
              next: (profile) => {
                console.log('[ProfileComponent] Profile loaded successfully:', profile);
                this.profile = profile;
              },
              error: (error) => {
                console.error('[ProfileComponent] Profile load error:', error);
                this.error = error.message || 'Failed to load profile. Please try again.';
              }
            });
        },
        error: (error) => {
          console.error('[ProfileComponent] User fetch error:', error);
          this.error = 'Failed to get user information';
          this.loading = false;
        }
      });
  }

  formatDate(date: string): string {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('[ProfileComponent] Date formatting error:', error);
      return 'Invalid date';
    }
  }

  openGithub(url: string) {
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}