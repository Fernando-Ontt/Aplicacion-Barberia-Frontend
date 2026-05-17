import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingRendimiento } from './ranking-rendimiento';

describe('RankingRendimiento', () => {
  let component: RankingRendimiento;
  let fixture: ComponentFixture<RankingRendimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingRendimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingRendimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
