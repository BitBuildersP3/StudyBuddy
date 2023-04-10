import { TestBed } from '@angular/core/testing';

import { OwnRegisterFileService } from './own-register-file.service';

describe('OwnRegisterFileService', () => {
  let service: OwnRegisterFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnRegisterFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
