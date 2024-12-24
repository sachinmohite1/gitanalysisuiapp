import { Component, Input, OnInit } from '@angular/core';
import { TrustScoreData } from '../models/trust-score.model';
import { ChartOptions } from 'chart.js';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ScaleType , LegendPosition } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-metrics-chart',
  templateUrl: './metrics-chart.component.html',
  styleUrls: ['./metrics-chart.component.css'],
  standalone: true,
  imports: [CommonModule, NgxChartsModule
  ],
})
export class MetricsChartComponent implements OnInit {
  
  LegendPosition = LegendPosition; // Make enum available in template

  @Input() data!: TrustScoreData;
  
  chartData: any[] = [];
  

  // Custom colors for each metric
  customColors = [
    { name: 'Repositories', value: '#22c55e' },
    { name: 'Followers', value: '#3b82f6' },
    { name: 'Stars', value: '#eab308' },
    { name: 'Forks', value: '#ef4444' },
    { name: 'Commits', value: '#8b5cf6' },
    { name: 'Contributions', value: '#06b6d4' },
    { name: 'Trustworthiness', value: '#f97316' },
    { name: 'Confidence', value: '#4f46e5' } // Added for confidence
  ];

  // Color scheme (still needed for chart initialization)
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.customColors.map(color => color.value)
  };

  ngOnInit() {
    // Null check for data
    if (!this.data?.username) {
      console.warn('No data provided to MetricsChartComponent');
      return;
    }

    // Update chartData with additional fields
    this.chartData = [
      { name: 'Repositories', value: this.data.repositories },
      { name: 'Followers', value: this.data.followers },
      { name: 'Stars', value: this.data.stars },
      { name: 'Forks', value: this.data.forks },
      { name: 'Commits', value: this.data.commits },
      { name: 'Contributions', value: this.data.contributions },
      { name: 'Trustworthiness', value: this.data.trustworthiness_score },
      {
        name: 'Confidence', // New metric added to display confidence
        value: this.data.confidence // Accessing confidence directly from TrustScoreData
      }
       ];
  }

  ngAfterViewInit() {
    // Force chart update after view initialization
    setTimeout(() => {
      this.chartData = [...this.chartData];
    }, 100);
  }
}