import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableVentasComisiones } from './table-ventas-comisiones';

describe('TableVentasComisiones', () => {
  let component: TableVentasComisiones;
  let fixture: ComponentFixture<TableVentasComisiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableVentasComisiones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableVentasComisiones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
