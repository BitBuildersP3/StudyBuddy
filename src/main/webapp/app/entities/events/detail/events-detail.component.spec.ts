import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventsDetailComponent } from './events-detail.component';

describe('Events Management Detail Component', () => {
  let comp: EventsDetailComponent;
  let fixture: ComponentFixture<EventsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ events: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EventsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EventsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load events on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.events).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
