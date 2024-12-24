export interface GithubRepo {
    name: string;
    commits: number;
    stars: number;
    forks: number;
    last_commit: string;
    [key: string]: string | number; // Index signature to allow string indexing
  }