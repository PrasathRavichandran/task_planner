import { TestBed } from '@angular/core/testing';

import { WebReqInterceptor} from './web-req.interceptor.service';

describe('WebReq.InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebReqInterceptor = TestBed.get(WebReqInterceptor);
    expect(service).toBeTruthy();
  });
});
