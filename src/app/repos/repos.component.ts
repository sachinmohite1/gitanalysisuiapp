import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GithubRepo } from '../models/github-repo.model';
import { GithubRepoService } from '../service/github-repo.service';
import { AuthService } from '../service/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'commits', 'stars', 'forks', 'last_commit', 'actions'];
  dataSource: MatTableDataSource<GithubRepo>;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();
  showSuggestions = false;
  activeFilters: string[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private repoService: GithubRepoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<GithubRepo>([]);
  }

  ngOnInit() {
    this.loadRepositories();
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.applyFilter({ target: input } as unknown as Event);
    this.showSuggestions = false;
  }

  applyQuickFilter(filter: string) {
    let filterValue = '';
    
    switch(filter) {
      case 'Most Stars':
        this.dataSource.sort = this.sort;
        this.sort.sort({ id: 'stars', start: 'desc', disableClear: false });
        break;
      case 'Recently Updated':
        this.dataSource.sort = this.sort;
        this.sort.sort({ id: 'last_commit', start: 'desc', disableClear: false });
        break;
      case 'Most Forks':
        this.dataSource.sort = this.sort;
        this.sort.sort({ id: 'forks', start: 'desc', disableClear: false });
        break;
    }

    if (!this.activeFilters.includes(filter)) {
      this.activeFilters.push(filter);
    }
    
    this.showSuggestions = false;
  }

  removeFilter(filter: string) {
    this.activeFilters = this.activeFilters.filter(f => f !== filter);
    if (this.activeFilters.length === 0) {
      // Reset sorting if no filters are active
      this.dataSource.sort = this.sort;
      this.sort.sort({ id: '', start: 'asc', disableClear: false });
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configure custom sort comparator
    this.dataSource.sortingDataAccessor = (item: GithubRepo, property: string) => {
      switch (property) {
        case 'name':
          return item.name.toLowerCase();
        case 'last_commit':
          return new Date(item.last_commit).getTime();
        case 'commits':
          return item.commits;
        case 'stars':
          return item.stars;
        case 'forks':
          return item.forks;
        default:
          return item[property] as string | number;
      }
    };
    
    this.cdr.detectChanges();
  }

  loadRepositories() {
    this.loading = true;
    this.error = '';

    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user?.user_metadata['user_name']) {
            this.repoService.getRepositories(user.user_metadata['user_name'])
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (repos) => {
                  this.dataSource = new MatTableDataSource(repos);
                  if (this.paginator) {
                    this.dataSource.paginator = this.paginator;
                  }
                  if (this.sort) {
                    this.dataSource.sort = this.sort;
                  }
                  this.loading = false;
                },
                error: (error) => {
                  console.error('Error fetching repositories:', error);
                  this.error = 'Failed to load repositories. Please try again.';
                  this.loading = false;
                }
              });
          } else {
            this.error = 'User not found';
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Error getting user:', error);
          this.error = 'Failed to get user information';
          this.loading = false;
        }
      });
  }

  // Update the existing applyFilter method
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Show suggestions when user starts typing
    this.showSuggestions = filterValue.length > 0;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  openRepository(repoName: string) {
    window.open(`https://github.com/${repoName}`, '_blank');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}