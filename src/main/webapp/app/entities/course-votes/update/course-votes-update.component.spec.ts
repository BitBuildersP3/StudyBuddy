import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CourseVotesFormService } from './course-votes-form.service';
import { CourseVotesService } from '../service/course-votes.service';
import { ICourseVotes } from '../course-votes.model';

import { CourseVotesUpdateComponent } from './course-votes-update.component';

describe('CourseVotes Management Update Component', () => {
  let comp: CourseVotesUpdateComponent;
  let fixture: ComponentFixture<CourseVotesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let courseVotesFormService: CourseVotesFormService;
  let courseVotesService: CourseVotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CourseVotesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CourseVotesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CourseVotesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    courseVotesFormService = TestBed.inject(CourseVotesFormService);
    courseVotesService = TestBed.inject(CourseVotesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const courseVotes: ICourseVotes = { id: 456 };

      activatedRoute.data = of({ courseVotes });
      comp.ngOnInit();

      expect(comp.courseVotes).toEqual(courseVotes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourseVotes>>();
      const courseVotes = { id: 123 };
      jest.spyOn(courseVotesFormService, 'getCourseVotes').mockReturnValue(courseVotes);
      jest.spyOn(courseVotesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseVotes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courseVotes }));
      saveSubject.complete();

      // THEN
      expect(courseVotesFormService.getCourseVotes).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(courseVotesService.update).toHaveBeenCalledWith(expect.objectContaining(courseVotes));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourseVotes>>();
      const courseVotes = { id: 123 };
      jest.spyOn(courseVotesFormService, 'getCourseVotes').mockReturnValue({ id: null });
      jest.spyOn(courseVotesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseVotes: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courseVotes }));
      saveSubject.complete();

      // THEN
      expect(courseVotesFormService.getCourseVotes).toHaveBeenCalled();
      expect(courseVotesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourseVotes>>();
      const courseVotes = { id: 123 };
      jest.spyOn(courseVotesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseVotes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(courseVotesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
