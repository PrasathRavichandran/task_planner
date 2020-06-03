import { TestBed } from '@angular/core/testing';

import { WebrequestService } from './webrequest.service';

describe('WebrequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebrequestService = TestBed.get(WebrequestService);
    expect(service).toBeTruthy();
  });
});
