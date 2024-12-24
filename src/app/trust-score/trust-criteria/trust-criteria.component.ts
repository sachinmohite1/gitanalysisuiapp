import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trust-criteria',
  templateUrl: './trust-criteria.component.html',
  styleUrls: ['./trust-criteria.component.css'],
  standalone: true,
  imports: [CommonModule] // Ensure CommonModule is imported
})
export class TrustCriteriaComponent {
  @Input() criteria!: string[];
}