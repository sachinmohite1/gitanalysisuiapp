import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrustScoreVisualizationComponent } from './trust-score-visualization/trust-score-visualization.component';
import { TrustScoreHeaderComponent } from './trust-score-header/trust-score-header.component';
import { KeyMetricsComponent } from './key-metrics/key-metrics.component';
import { MetricsChartComponent } from './metrics-chart/metrics-chart.component';
import { TrustCriteriaComponent } from './trust-criteria/trust-criteria.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { SmartContractDialogComponent } from './smart-contract-dialog/smart-contract-dialog.component';

@NgModule({
  declarations: [
    TrustScoreVisualizationComponent,
    TrustScoreHeaderComponent,
    KeyMetricsComponent,
    SmartContractDialogComponent
  ],
  imports: [
    CommonModule, // Use CommonModule here
    MetricsChartComponent,
    FormsModule,
    HttpClientModule,
    TrustCriteriaComponent,
    NgChartsModule
  ],
  exports: [
    TrustScoreVisualizationComponent,
    TrustScoreHeaderComponent,
    KeyMetricsComponent,
    MetricsChartComponent,
    TrustCriteriaComponent
  ]
})
export class TrustScoreModule { }
