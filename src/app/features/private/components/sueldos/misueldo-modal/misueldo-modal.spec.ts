import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisueldoModal } from './misueldo-modal';

describe('MisueldoModal', () => {
  let component: MisueldoModal;
  let fixture: ComponentFixture<MisueldoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisueldoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisueldoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
