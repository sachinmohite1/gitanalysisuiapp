import { Injectable } from '@angular/core';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable ,from, retry, catchError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject to track the current user state
  private user = new BehaviorSubject<User | null>(null);
  private supabase!: SupabaseClient;
  
  // Configuration for retry logic
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(private router: Router) {
    this.initializeSupabase();
    this.setupAuthStateChange();
    this.loadInitialSession();
  }

  private initializeSupabase() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: {
            // Custom storage implementation to avoid lock conflicts
            getItem: (key: string) => {
              try {
                const item = localStorage.getItem(key);
                return Promise.resolve(item);
              } catch (error) {
                console.error('Error getting item from storage:', error);
                return Promise.resolve(null);
              }
            },
            setItem: (key: string, value: string) => {
              try {
                localStorage.setItem(key, value);
                return Promise.resolve();
              } catch (error) {
                console.error('Error setting item in storage:', error);
                return Promise.resolve();
              }
            },
            removeItem: (key: string) => {
              try {
                localStorage.removeItem(key);
                return Promise.resolve();
              } catch (error) {
                console.error('Error removing item from storage:', error);
                return Promise.resolve();
              }
            }
          }
        },
      }
    );
  }

  private setupAuthStateChange() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      console.log('Session:', session);

      switch (event) {
        case 'SIGNED_IN':
          this.user.next(session?.user || null);
          // Check if we're on the callback route
          if (window.location.pathname === '/home') {
            this.router.navigate(['/home/dashboard']);
          }
          break;

        case 'SIGNED_OUT':
          this.user.next(null);
          this.router.navigate(['/home']);
          break;

        case 'TOKEN_REFRESHED':
          this.user.next(session?.user || null);
          break;

        case 'USER_UPDATED':
          this.user.next(session?.user || null);
          break;

        default:
          break;
      }
    });
  }

  private async loadInitialSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) {
        throw error;
      }
      this.user.next(session?.user || null);
    } catch (error) {
      console.error('Error loading initial session:', error);
      this.user.next(null);
    }
  }

  async signInWithGithub() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user user:email'
        }
      });

      if (error) throw error;
      return data;

    } catch (error) {
      if ((error as Error).message.includes('LockManager lock')) {
        return this.retrySignIn();
      }
      throw error;
    }
  }

  private async retrySignIn(retryCount = 0): Promise<any> {
    if (retryCount >= this.maxRetries) {
      throw new Error('Max retry attempts reached for sign in');
    }

    try {
      console.log(`Retry attempt ${retryCount + 1}`);
      
      // Exponential backoff delay
      const delay = this.retryDelay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));

      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user user:email'
        }
      });

      if (error) throw error;
      return data;

    } catch (error) {
      if ((error as Error).message.includes('LockManager lock')) {
        return this.retrySignIn(retryCount + 1);
      }
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local state if needed
      this.user.next(null);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Method to get the current session
  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Method to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  // Method to refresh session
  async refreshSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.refreshSession();
      if (error) throw error;
      this.user.next(session?.user || null);
      return session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }

  // Observable to subscribe to user state changes
  get currentUser(): Observable<User | null> {
    return this.user.asObservable();
  }

  // Method to get current user value synchronously
  get currentUserValue(): User | null {
    return this.user.value;
  }

  // Method to update user data
  async updateUserData(data: { [key: string]: any }) {
    try {
      const { data: userData, error } = await this.supabase.auth.updateUser({
        data: data
      });

      if (error) throw error;
      this.user.next(userData.user);
      return userData.user;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  // Method to handle auth errors
  private handleAuthError(error: any): never {
    console.error('Authentication error:', error);
    // You could add additional error handling here
    throw error;
  }
}