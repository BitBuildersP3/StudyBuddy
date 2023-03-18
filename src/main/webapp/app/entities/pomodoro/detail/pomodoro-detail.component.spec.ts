import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PomodoroDetailComponent } from './pomodoro-detail.component';

describe('Pomodoro Management Detail Component', () => {
  let comp: PomodoroDetailComponent;
  let fixture: ComponentFixture<PomodoroDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PomodoroDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pomodoro: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PomodoroDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PomodoroDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pomodoro on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pomodoro).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
