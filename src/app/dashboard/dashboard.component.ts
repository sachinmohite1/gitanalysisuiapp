import { Component, ViewChild, AfterViewInit , OnInit} from '@angular/core';

import { TrustScoreModule } from '../trust-score/trust-score.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [TrustScoreModule
    
  ],  // Add MatPaginatorModule here
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
}