import { TestBed } from '@angular/core/testing';

import { ToolPomodoreService } from './tool-pomodore.service';

describe('ToolPomodoreService', () => {
  let service: ToolPomodoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolPomodoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
