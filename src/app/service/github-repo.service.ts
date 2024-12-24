import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubRepo } from '../models/github-repo.model';

@Injectable({
  providedIn: 'root'
})
export class GithubRepoService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getRepositories(username: string): Observable<GithubRepo[]> {
    return this.http.get<GithubRepo[]>(`${this.apiUrl}/github/user/${username}/repos`);
  }
}