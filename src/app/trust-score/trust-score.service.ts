// trust-score.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TrustScoreResponse, TrustScoreData } from './models/trust-score.model';

@Injectable({
  providedIn: 'root'
})
export class TrustScoreService {
  private apiUrl = 'http://localhost:5000/api';
  private cachedResponses = new Map<string, TrustScoreData>();

  constructor(private http: HttpClient) {}

  getProfileSummary(username: string): Observable<any> {
    // Check if we already have a cached response
    if (this.cachedResponses.has(username)) {
      return of(this.cachedResponses.get(username));
    }

    //return this.http.get(`${this.apiUrl}/profile/${username}/latest`).pipe(
    return this.http.get(`${this.apiUrl}/profile/${username}/latest`).pipe(
      map(response => {
        // Check if all values are zero
        const isEmptyProfile = this.isEmptyProfileData(response);
        if (isEmptyProfile) {
          throw new Error('Empty profile data');
        }
        return response;
      }),
      catchError(error => {
        // If there's an error or empty profile, throw it to be handled by the component
        throw error;
      })
    );
  }

  getPredictedScore(username: string): Observable<TrustScoreData> {
    // Check if we already have a cached response
  //  if (this.cachedResponses.has(username)) {
  //    return of(this.cachedResponses.get(username)!);
  //  }

    return this.http.get<TrustScoreResponse>(`${this.apiUrl}/github/user/${username}/predict`)
      .pipe(
        map(response => {
          const transformedResponse = this.transformToTrustScoreData(response);
          // Cache the response
          this.cachedResponses.set(username, transformedResponse);
          return transformedResponse;
        })
      );
  }

  // Made public for use in component
  transformProfileToTrustScoreData(profileData: any, username: string, trustworthiness: number): TrustScoreData {
    return this.transformToTrustScoreData({
      ...profileData,
      username,
      trustworthiness,
      confidence: 1.0
    });
  }

  // Made public for calculating trustworthiness in both service and component
  calculateTrustworthiness(data: any): number {
    let score = 0;
    if (data.repositories > 10 || data.contributions > 500) score++;
    if (data.followers > 50 || data.stars > 100) score++;
    if (data.commits > 1000 || data.forks > 50) score++;
    return Math.min(score, 3);
  }

  isEmptyProfileData(data: any): boolean {
    return (
      data.commits === 0 &&
      data.contributions === 0 &&
      data.followers === 0 &&
      data.forks === 0 &&
      data.repositories === 0 &&
      data.stars === 0
    );
  }

  private transformToTrustScoreData(response: TrustScoreResponse): TrustScoreData {
    return {
      username: response.username,
      trustworthiness_score: response.trustworthiness,
      confidence: response.confidence,
      rating_level: this.getRatingLevel(response.trustworthiness),
      description: this.getDescription(response.trustworthiness),
      criteria: this.getCriteria(response.trustworthiness),
      stars: response.stars,
      forks: response.forks,
      followers: response.followers,
      repositories: response.repositories,
      commits: response.commits,
      contributions: response.contributions
    };
  }

  private getRatingLevel(score: number): string {
    if (score === 3) return 'Very High Trust';
    if (score === 2) return 'High Trust';
    if (score === 1) return 'Moderate Trust';
    return 'Low Trust';
  }

  private getDescription(score: number): string {
    if (score === 3) return 'Account demonstrates exceptional activity and leadership in the community';
    if (score === 2) return 'Account shows consistent and reliable activity patterns';
    if (score === 1) return 'Account displays moderate community engagement';
    return 'Account needs more activity to establish trust';
  }

  private getCriteria(score: number): string[] {
    const criteria = [];
    if (score >= 1) criteria.push('Basic account verification');
    if (score >= 2) criteria.push('Consistent contribution history');
    if (score >= 3) criteria.push('Significant community impact');
    return criteria;
  }
}