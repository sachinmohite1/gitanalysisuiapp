// trust-score-visualization.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrustScoreService } from '../trust-score.service';
import { TrustScoreData } from '../models/trust-score.model';
import { AuthService } from 'src/app/service/auth.service';
import { User } from '@supabase/supabase-js';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ethers } from 'ethers';

@Component({
  selector: 'app-trust-score-visualization',
  templateUrl: './trust-score-visualization.component.html',
  styleUrls: ['./trust-score-visualization.component.css']
})
export class TrustScoreVisualizationComponent implements OnInit, OnDestroy {
  username: string = '';
  data?: TrustScoreData;
  loading: boolean = false;
  error: string = '';
  isMetaMaskConnected: boolean = false;
  showAnalyzingPopup: boolean = false;
  private destroy$ = new Subject<void>();

  currentUser$: Observable<User | null>;
  isEmptyProfile: boolean = false;

  
  constructor(
    private trustScoreService: TrustScoreService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async user => {
        if (user) {
          console.log('User metadata:', user.user_metadata);
          this.username = user.user_metadata['user_name'];
          await this.checkMetaMaskConnection();
          
          if (this.isMetaMaskConnected && this.username) {
            await this.fetchData();
          } else if (!this.isMetaMaskConnected) {
            this.error = 'Please connect to MetaMask first';
          }
        } else {
          this.error = 'User not logged in';
        }
    });
  }

  private async checkMetaMaskConnection(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        this.isMetaMaskConnected = accounts.length > 0;
        
        if (!this.isMetaMaskConnected) {
          await this.connectToMetaMask();
        }
      } catch (error) {
        console.error('Error checking MetaMask status:', error);
        this.error = 'Error connecting to MetaMask';
      }
    } else {
      this.error = 'MetaMask is not installed';
      console.log('MetaMask is not installed');
    }
  }

  async connectToMetaMask(): Promise<void> {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      this.isMetaMaskConnected = true;
      console.log('Connected to MetaMask:', address);
      
      if (this.username) {
        await this.fetchData();
      }
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      this.error = 'Failed to connect to MetaMask';
      this.isMetaMaskConnected = false;
    }
  }

  async fetchData(): Promise<void> {
    if (!this.isMetaMaskConnected) {
      this.error = 'Please connect to MetaMask first';
      return;
    }

    if (!this.username) {
      this.error = 'GitHub username not found';
      return;
    }

    this.loading = true;
    this.error = '';
    this.showAnalyzingPopup = true;

    // First try to get profile summary
    this.trustScoreService.getProfileSummary(this.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profileData) => {
          // If we get valid profile data, transform it
          const trustworthiness = this.trustScoreService.calculateTrustworthiness(profileData);
          this.data = this.trustScoreService.transformProfileToTrustScoreData(
            profileData,
            this.username,
            trustworthiness
          );
          this.isEmptyProfile = this.trustScoreService.isEmptyProfileData(profileData);
          this.loading = false;
          this.showAnalyzingPopup = false;
        },
        error: () => {
          // If profile summary fails or returns empty data, try predicted score
          console.log('Profile summary empty or failed, trying predicted score...');
          this.isEmptyProfile = true;
          this.trustScoreService.getPredictedScore(this.username)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                this.data = response;
                this.loading = false;
                this.showAnalyzingPopup = false;
              },
              error: (error) => {
                console.error('Error fetching predicted score:', error);
                this.error = 'Error fetching trust score. Please try again.';
                this.loading = false;
                this.showAnalyzingPopup = false;
              }
            });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}