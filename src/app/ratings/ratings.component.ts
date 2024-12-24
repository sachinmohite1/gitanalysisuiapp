import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface RatingData {
  commits: number;
  confidence: number;
  contributions: number;
  followers: number;
  forks: number;
  repositories: number;
  stars: number;
  trustworthiness: number;
  username: string;
}

interface RatingHistory {
  data: RatingData;
  date: number;
  ipfs_hash: string;
  trustworthiness: number;
}

interface RatingResponse {
  history: RatingHistory[];
  username: string;
}

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  displayedColumns: string[] = [
    'date',
    'trustworthiness',
    'confidence',
    'commits',
    'contributions',
    'followers',
    'forks',
    'repositories',
    'stars',
    'ipfs_hash'
  ];
  dataSource: MatTableDataSource<RatingHistory>;
  username: string = 'sachinmohite1';
  isLoading: boolean = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {
    this.dataSource = new MatTableDataSource<RatingHistory>([]);
  }

  ngOnInit() {
    this.fetchRatingHistory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchRatingHistory() {
    this.isLoading = true;
    this.error = null;
    
    this.http.get<RatingResponse>(`http://127.0.0.1:5000/api/profile/${this.username}/history`)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.history;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to fetch rating history';
          this.isLoading = false;
          console.error('Error fetching rating history:', error);
        }
      });
  }

  formatDate(dateNumber: number): string {
    const year = Math.floor(dateNumber / 10000);
    const month = Math.floor((dateNumber % 10000) / 100);
    const day = dateNumber % 100;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  recalculateRatings() {
    this.isLoading = true;
    this.error = null;
    
    this.http.post(`http://127.0.0.1:5000/api/profile/${this.username}/recalculate`, {})
      .subscribe({
        next: () => {
          this.fetchRatingHistory();
        },
        error: (error) => {
          this.error = 'Failed to recalculate ratings';
          this.isLoading = false;
          console.error('Error recalculating ratings:', error);
        }
      });
  }
}