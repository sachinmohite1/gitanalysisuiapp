import { Component, Input } from '@angular/core';
import { TrustScoreData } from '../models/trust-score.model';

@Component({
  selector: 'app-key-metrics',
  templateUrl: './key-metrics.component.html',
  styleUrls: ['./key-metrics.component.css']
})
export class KeyMetricsComponent {
  @Input() data!: TrustScoreData;

  get metrics() {
    return [
      {
        icon: 'shield',
        label: 'Trust Score',
        value: `${this.data.trustworthiness_score}/3`
      },
      {
        icon: 'git-commit',
        label: 'Total Commits',
        value: this.data.commits.toLocaleString()
      },
      {
        icon: 'users',
        label: 'Followers',
        value: this.data.followers.toLocaleString()
      }
    ];
  }
}
