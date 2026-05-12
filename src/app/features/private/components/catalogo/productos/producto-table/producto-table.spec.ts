import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoTable } from './producto-table.component';

describe('ProductoTable', () => {
  let component: ProductoTable;
  let fixture: ComponentFixture<ProductoTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
