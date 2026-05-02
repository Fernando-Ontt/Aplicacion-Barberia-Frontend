import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolGuardsGuard } from './rol-guards-guard';

describe('rolGuardsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolGuardsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
