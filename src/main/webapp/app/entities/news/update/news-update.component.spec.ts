import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NewsFormService } from './news-form.service';
import { NewsService } from '../service/news.service';
import { INews } from '../news.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { NewsUpdateComponent } from './news-update.component';

describe('News Management Update Component', () => {
  let comp: NewsUpdateComponent;
  let fixture: ComponentFixture<NewsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let newsFormService: NewsFormService;
  let newsService: NewsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NewsUpdateComponent],
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
      .overrideTemplate(NewsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NewsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    newsFormService = TestBed.inject(NewsFormService);
    newsService = TestBed.inject(NewsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const news: INews = { id: 456 };
      const user: IUser = { id: 3631 };
      news.user = user;

      const userCollection: IUser[] = [{ id: 75357 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ news });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const news: INews = { id: 456 };
      const user: IUser = { id: 79764 };
      news.user = user;

      activatedRoute.data = of({ news });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.news).toEqual(news);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INews>>();
      const news = { id: 123 };
      jest.spyOn(newsFormService, 'getNews').mockReturnValue(news);
      jest.spyOn(newsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ news });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: news }));
      saveSubject.complete();

      // THEN
      expect(newsFormService.getNews).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(newsService.update).toHaveBeenCalledWith(expect.objectContaining(news));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INews>>();
      const news = { id: 123 };
      jest.spyOn(newsFormService, 'getNews').mockReturnValue({ id: null });
      jest.spyOn(newsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ news: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: news }));
      saveSubject.complete();

      // THEN
      expect(newsFormService.getNews).toHaveBeenCalled();
      expect(newsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INews>>();
      const news = { id: 123 };
      jest.spyOn(newsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ news });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(newsService.update).toHaveBeenCalled();
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
  });
});
