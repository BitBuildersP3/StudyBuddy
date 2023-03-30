import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorTypeFileComponent } from './selector-type-file.component';

describe('SelectorTypeFileComponent', () => {
  let component: SelectorTypeFileComponent;
  let fixture: ComponentFixture<SelectorTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectorTypeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
