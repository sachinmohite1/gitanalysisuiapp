import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GithubProfile } from '../models/github-profile.model';

@Injectable({
  providedIn: 'root'
})
export class GithubProfileService {
  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) { }

  getProfile(username: string): Observable<GithubProfile> {
    if (!username) {
      return throwError(() => new Error('Username is required'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any required authentication headers here
      // 'Authorization': `Bearer ${this.authService.getToken()}`
    });

    console.log(`[GithubProfileService] Fetching profile for username: ${username}`);
    
    return this.http.get<GithubProfile>(
      `${this.apiUrl}/github/user/${encodeURIComponent(username)}/profile`,
      { headers }
    ).pipe(
      tap(response => {
        console.log('[GithubProfileService] Profile fetch successful:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while fetching the profile.';

    if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.status === 404) {
      errorMessage = 'GitHub profile not found.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized access. Please check your authentication.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error message: ${error.error?.message || error.message}`;
    }

    console.error('[GithubProfileService] Error:', {
      status: error.status,
      message: errorMessage,
      error: error
    });

    return throwError(() => new Error(errorMessage));
  }
}