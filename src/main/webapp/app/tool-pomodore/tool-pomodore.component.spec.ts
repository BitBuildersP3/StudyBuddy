import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPomodoreComponent } from './tool-pomodore.component';

describe('ToolPomodoreComponent', () => {
  let component: ToolPomodoreComponent;
  let fixture: ComponentFixture<ToolPomodoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolPomodoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolPomodoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
