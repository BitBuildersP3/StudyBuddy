import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CoursesFormService } from './courses-form.service';
import { CoursesService } from '../service/courses.service';
import { ICourses } from '../courses.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

import { CoursesUpdateComponent } from './courses-update.component';

describe('Courses Management Update Component', () => {
  let comp: CoursesUpdateComponent;
  let fixture: ComponentFixture<CoursesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let coursesFormService: CoursesFormService;
  let coursesService: CoursesService;
  let userService: UserService;
  let categoryService: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CoursesUpdateComponent],
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
      .overrideTemplate(CoursesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CoursesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    coursesFormService = TestBed.inject(CoursesFormService);
    coursesService = TestBed.inject(CoursesService);
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const courses: ICourses = { id: 456 };
      const users: IUser[] = [{ id: 82225 }];
      courses.users = users;

      const userCollection: IUser[] = [{ id: 89920 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [...users];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Category query and add missing value', () => {
      const courses: ICourses = { id: 456 };
      const category: ICategory = { id: 72887 };
      courses.category = category;

      const categoryCollection: ICategory[] = [{ id: 87255 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [category];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining)
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const courses: ICourses = { id: 456 };
      const user: IUser = { id: 84659 };
      courses.users = [user];
      const category: ICategory = { id: 6701 };
      courses.category = category;

      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.categoriesSharedCollection).toContain(category);
      expect(comp.courses).toEqual(courses);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourses>>();
      const courses = { id: 123 };
      jest.spyOn(coursesFormService, 'getCourses').mockReturnValue(courses);
      jest.spyOn(coursesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courses }));
      saveSubject.complete();

      // THEN
      expect(coursesFormService.getCourses).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(coursesService.update).toHaveBeenCalledWith(expect.objectContaining(courses));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourses>>();
      const courses = { id: 123 };
      jest.spyOn(coursesFormService, 'getCourses').mockReturnValue({ id: null });
      jest.spyOn(coursesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courses: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courses }));
      saveSubject.complete();

      // THEN
      expect(coursesFormService.getCourses).toHaveBeenCalled();
      expect(coursesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICourses>>();
      const courses = { id: 123 };
      jest.spyOn(coursesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courses });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(coursesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCategory', () => {
      it('Should forward to categoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoryService, 'compareCategory');
        comp.compareCategory(entity, entity2);
        expect(categoryService.compareCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
