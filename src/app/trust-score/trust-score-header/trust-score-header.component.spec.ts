import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustScoreHeaderComponent } from './trust-score-header.component';

describe('TrustScoreHeaderComponent', () => {
  let component: TrustScoreHeaderComponent;
  let fixture: ComponentFixture<TrustScoreHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrustScoreHeaderComponent]
    });
    fixture = TestBed.createComponent(TrustScoreHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
