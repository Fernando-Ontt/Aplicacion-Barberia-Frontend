import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reclamos } from './reclamos';

describe('Reclamos', () => {
  let component: Reclamos;
  let fixture: ComponentFixture<Reclamos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reclamos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reclamos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
