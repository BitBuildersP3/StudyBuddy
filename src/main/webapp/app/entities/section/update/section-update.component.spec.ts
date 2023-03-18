import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SectionFormService } from './section-form.service';
import { SectionService } from '../service/section.service';
import { ISection } from '../section.model';
import { ICourses } from 'app/entities/courses/courses.model';
import { CoursesService } from 'app/entities/courses/service/courses.service';

import { SectionUpdateComponent } from './section-update.component';

describe('Section Management Update Component', () => {
  let comp: SectionUpdateComponent;
  let fixture: ComponentFixture<SectionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sectionFormService: SectionFormService;
  let sectionService: SectionService;
  let coursesService: CoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SectionUpdateComponent],
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
      .overrideTemplate(SectionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SectionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sectionFormService = TestBed.inject(SectionFormService);
    sectionService = TestBed.inject(SectionService);
    coursesService = TestBed.inject(CoursesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Courses query and add missing value', () => {
      const section: ISection = { id: 456 };
      const courses: ICourses = { id: 51671 };
      section.courses = courses;

      const coursesCollection: ICourses[] = [{ id: 93775 }];
      jest.spyOn(coursesService, 'query').mockReturnValue(of(new HttpResponse({ body: coursesCollection })));
      const additionalCourses = [courses];
      const expectedCollection: ICourses[] = [...additionalCourses, ...coursesCollection];
      jest.spyOn(coursesService, 'addCoursesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ section });
      comp.ngOnInit();

      expect(coursesService.query).toHaveBeenCalled();
      expect(coursesService.addCoursesToCollectionIfMissing).toHaveBeenCalledWith(
        coursesCollection,
        ...additionalCourses.map(expect.objectContaining)
      );
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const section: ISection = { id: 456 };
      const courses: ICourses = { id: 76371 };
      section.courses = courses;

      activatedRoute.data = of({ section });
      comp.ngOnInit();

      expect(comp.coursesSharedCollection).toContain(courses);
      expect(comp.section).toEqual(section);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISection>>();
      const section = { id: 123 };
      jest.spyOn(sectionFormService, 'getSection').mockReturnValue(section);
      jest.spyOn(sectionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ section });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: section }));
      saveSubject.complete();

      // THEN
      expect(sectionFormService.getSection).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sectionService.update).toHaveBeenCalledWith(expect.objectContaining(section));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISection>>();
      const section = { id: 123 };
      jest.spyOn(sectionFormService, 'getSection').mockReturnValue({ id: null });
      jest.spyOn(sectionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ section: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: section }));
      saveSubject.complete();

      // THEN
      expect(sectionFormService.getSection).toHaveBeenCalled();
      expect(sectionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISection>>();
      const section = { id: 123 };
      jest.spyOn(sectionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ section });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sectionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCourses', () => {
      it('Should forward to coursesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(coursesService, 'compareCourses');
        comp.compareCourses(entity, entity2);
        expect(coursesService.compareCourses).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
