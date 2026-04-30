import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoLayout } from './empleado-layout';

describe('EmpleadoLayout', () => {
  let component: EmpleadoLayout;
  let fixture: ComponentFixture<EmpleadoLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
