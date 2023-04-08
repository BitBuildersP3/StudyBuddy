import { TestBed } from '@angular/core/testing';

import { IndexRegisterFileService } from './index-register-file.service';

describe('IndexRegisterFileService', () => {
  let service: IndexRegisterFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexRegisterFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
