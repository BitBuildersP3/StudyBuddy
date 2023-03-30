import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorFileComponent } from './selector-file.component';

describe('SelectorFileComponent', () => {
  let component: SelectorFileComponent;
  let fixture: ComponentFixture<SelectorFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectorFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
