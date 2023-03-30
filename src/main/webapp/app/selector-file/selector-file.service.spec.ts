import { TestBed } from '@angular/core/testing';

import { SelectorFileService } from './selector-file.service';

describe('SelectorFileService', () => {
  let service: SelectorFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectorFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
