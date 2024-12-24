import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustCriteriaComponent } from './trust-criteria.component';

describe('TrustCriteriaComponent', () => {
  let component: TrustCriteriaComponent;
  let fixture: ComponentFixture<TrustCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrustCriteriaComponent]
    });
    fixture = TestBed.createComponent(TrustCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
