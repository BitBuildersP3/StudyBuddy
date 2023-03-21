import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudinaryButtonComponent } from './cloudinary-button.component';

describe('CloudinaryButtonComponent', () => {
  let component: CloudinaryButtonComponent;
  let fixture: ComponentFixture<CloudinaryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloudinaryButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloudinaryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
