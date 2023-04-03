import { TestBed } from '@angular/core/testing';

import { FilesManagerService } from './files-manager.service';

describe('FilesManagerService', () => {
  let service: FilesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
