import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPomComponent } from './tool-pom.component';

describe('ToolPomComponent', () => {
  let component: ToolPomComponent;
  let fixture: ComponentFixture<ToolPomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolPomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolPomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
