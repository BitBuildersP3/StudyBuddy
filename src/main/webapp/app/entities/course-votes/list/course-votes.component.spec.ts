import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CourseVotesService } from '../service/course-votes.service';

import { CourseVotesComponent } from './course-votes.component';

describe('CourseVotes Management Component', () => {
  let comp: CourseVotesComponent;
  let fixture: ComponentFixture<CourseVotesComponent>;
  let service: CourseVotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'course-votes', component: CourseVotesComponent }]), HttpClientTestingModule],
      declarations: [CourseVotesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CourseVotesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CourseVotesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CourseVotesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.courseVotes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to courseVotesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCourseVotesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCourseVotesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
