import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnRegisterFileComponent } from './own-register-file.component';

describe('OwnRegisterFileComponent', () => {
  let component: OwnRegisterFileComponent;
  let fixture: ComponentFixture<OwnRegisterFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnRegisterFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnRegisterFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
