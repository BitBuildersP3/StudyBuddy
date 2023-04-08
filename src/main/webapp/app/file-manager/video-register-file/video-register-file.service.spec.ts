import { TestBed } from '@angular/core/testing';

import { VideoRegisterFileService } from './video-register-file.service';

describe('VideoRegisterFileService', () => {
  let service: VideoRegisterFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoRegisterFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
