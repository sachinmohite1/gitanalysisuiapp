import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustScoreVisualizationComponent } from './trust-score-visualization.component';

describe('TrustScoreVisualizationComponent', () => {
  let component: TrustScoreVisualizationComponent;
  let fixture: ComponentFixture<TrustScoreVisualizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrustScoreVisualizationComponent]
    });
    fixture = TestBed.createComponent(TrustScoreVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
