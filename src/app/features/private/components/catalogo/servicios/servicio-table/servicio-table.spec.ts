import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioTable } from './servicio-table.component';

describe('ServicioTable', () => {
  let component: ServicioTable;
  let fixture: ComponentFixture<ServicioTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
