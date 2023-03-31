import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRegisterFileComponent } from './video-register-file.component';

describe('VideoRegisterFileComponent', () => {
  let component: VideoRegisterFileComponent;
  let fixture: ComponentFixture<VideoRegisterFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoRegisterFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoRegisterFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
