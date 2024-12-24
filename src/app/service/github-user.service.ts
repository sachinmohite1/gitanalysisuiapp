import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser } from '../models/github-user';

@Injectable({
  providedIn: 'root'
})
export class GithubUserService {
  
  private baseUrl = 'http://localhost:5000/github/user';

  constructor(private http: HttpClient) { }

  getUserDetails(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.baseUrl}/${username}`);
  }
}
