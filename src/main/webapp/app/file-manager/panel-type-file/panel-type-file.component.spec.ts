import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelTypeFileComponent } from './panel-type-file.component';

describe('PanelTypeFileComponent', () => {
  let component: PanelTypeFileComponent;
  let fixture: ComponentFixture<PanelTypeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelTypeFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelTypeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
