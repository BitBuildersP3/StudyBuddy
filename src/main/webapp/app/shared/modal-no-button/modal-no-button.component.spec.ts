import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoButtonComponent } from './modal-no-button.component';

describe('ModalNoButtonComponent', () => {
  let component: ModalNoButtonComponent;
  let fixture: ComponentFixture<ModalNoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNoButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
