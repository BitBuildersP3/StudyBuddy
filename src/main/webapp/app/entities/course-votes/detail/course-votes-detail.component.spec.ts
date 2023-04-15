import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CourseVotesDetailComponent } from './course-votes-detail.component';

describe('CourseVotes Management Detail Component', () => {
  let comp: CourseVotesDetailComponent;
  let fixture: ComponentFixture<CourseVotesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseVotesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ courseVotes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CourseVotesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CourseVotesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load courseVotes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.courseVotes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
