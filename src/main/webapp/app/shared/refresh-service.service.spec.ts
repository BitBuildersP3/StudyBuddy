import { TestBed } from '@angular/core/testing';

import { RefreshServiceService } from './refresh-service.service';

describe('RefreshServiceService', () => {
  let service: RefreshServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
