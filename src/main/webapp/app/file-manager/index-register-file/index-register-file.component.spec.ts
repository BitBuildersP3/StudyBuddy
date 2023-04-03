import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexRegisterFileComponent } from './index-register-file.component';

describe('IndexRegisterFileComponent', () => {
  let component: IndexRegisterFileComponent;
  let fixture: ComponentFixture<IndexRegisterFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexRegisterFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexRegisterFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
