import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CoursesService } from '../service/courses.service';

import { CoursesComponent } from './courses.component';

describe('Courses Management Component', () => {
  let comp: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let service: CoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'courses', component: CoursesComponent }]), HttpClientTestingModule],
      declarations: [CoursesComponent],
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
      .overrideTemplate(CoursesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CoursesService);

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
    expect(comp.courses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to coursesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCoursesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCoursesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
