export interface TrustScoreResponse {
  confidence: number;
  trustworthiness: number;
  username: string;
  stars: number;
  forks: number;
  followers: number;
  repositories: number;
  commits: number;
  contributions: number;
}
  
  export interface TrustScoreData {
    username: string;
    trustworthiness_score: number;
    confidence: number;
    rating_level: string;
    description: string;
    criteria: string[];
    stars: number;
    forks: number;
    followers: number;
    repositories: number;
    commits: number;
    contributions: number;

   
  }
  