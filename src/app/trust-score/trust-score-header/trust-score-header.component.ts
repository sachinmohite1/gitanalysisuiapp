import { Component, Input } from '@angular/core';
import { TrustScoreData } from '../models/trust-score.model';
import { HttpClient } from '@angular/common/http';
import { TrustScoreResponse } from '../models/trust-score.model';
import { TrustScoreService } from '../trust-score.service';
import { SmartContractDialogComponent } from '../smart-contract-dialog/smart-contract-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface SmartContractResponse {
  blockchain_result: {
    block_number: number;
    date: number;
    gas_used: number;
    success: boolean;
    transaction_hash: string;
  };
  current_ipfs_hash: string;
  history_ipfs_hash: string;
  success: boolean;
}

@Component({
  selector: 'app-trust-score-header',
  templateUrl: './trust-score-header.component.html',
  styleUrls: ['./trust-score-header.component.css']
})
export class TrustScoreHeaderComponent {
  @Input() data!: TrustScoreData;  // Accept the whole data object from parent
  @Input() trustLevel!: string; // assuming trustLevel is passed to the component
  @Input() isEmptyProfile: boolean = false;

  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(
    private http: HttpClient,
    private trustScoreService: TrustScoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('Header Component Data:', this.data);
    console.log('Is Empty Profile:', this.isEmptyProfile);
  }

  shouldShowSmartContractButton(): boolean {
    return this.isEmptyProfile && !!this.data;
  }
  
  // Define the colors object here
  public  getTrustLevelColor: Record<string, string> = {
    'Low Trust': 'bg-red-500',
    'Moderate Trust': 'bg-yellow-500',
    'High Trust': 'bg-green-500',
    'Very High Trust': 'bg-blue-500'
  };

  // Method to return the color based on the trust level
  getColor(level: string): string {
    return this.getTrustLevelColor[level] || 'bg-gray-500'; // default color if level doesn't match
  }

  createSmartContract() {
    if (!this.data) {
      console.error('No trust score data available');
      return;
    }

    // Create the request payload following TrustScoreResponse interface
    const payload: TrustScoreResponse = {
      username: this.data.username,
      trustworthiness: this.data.trustworthiness_score,
      confidence: this.data.confidence,
      stars: this.data.stars,
      forks: this.data.forks,
      followers: this.data.followers,
      repositories: this.data.repositories,
      commits: this.data.commits,
      contributions: this.data.contributions
    };

    // Make the POST request
    return this.http.post<SmartContractResponse>(`${this.apiUrl}/store_profile/`, payload)
      .subscribe({
        next: (response: SmartContractResponse) => {
          console.log('Smart contract created successfully', response);
          if (response.success && response.blockchain_result.success) {
            this.openSuccessDialog(response.blockchain_result.transaction_hash);
          }
          return response;
        },
        error: (error) => {
          console.error('Error creating smart contract:', error);
          throw error;
        }
      });
  }


  private openSuccessDialog(transactionHash: string): void {
    this.dialog.open(SmartContractDialogComponent, {
      width: '500px',
      data: { transactionHash }
    });
  }

  private openErrorDialog(): void {
    this.dialog.open(SmartContractDialogComponent, {
      width: '500px',
      data: { error: true, message: 'Failed to create smart contract. Please try again.' }
    });
  }


}