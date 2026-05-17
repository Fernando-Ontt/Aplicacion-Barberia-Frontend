import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCortesBarberoMes } from './table-cortes-barbero-mes';

describe('TableCortesBarberoMes', () => {
  let component: TableCortesBarberoMes;
  let fixture: ComponentFixture<TableCortesBarberoMes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCortesBarberoMes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCortesBarberoMes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
