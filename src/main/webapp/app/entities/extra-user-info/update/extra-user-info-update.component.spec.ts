import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExtraUserInfoFormService } from './extra-user-info-form.service';
import { ExtraUserInfoService } from '../service/extra-user-info.service';
import { IExtraUserInfo } from '../extra-user-info.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ExtraUserInfoUpdateComponent } from './extra-user-info-update.component';

describe('ExtraUserInfo Management Update Component', () => {
  let comp: ExtraUserInfoUpdateComponent;
  let fixture: ComponentFixture<ExtraUserInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let extraUserInfoFormService: ExtraUserInfoFormService;
  let extraUserInfoService: ExtraUserInfoService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExtraUserInfoUpdateComponent],
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
      .overrideTemplate(ExtraUserInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExtraUserInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    extraUserInfoFormService = TestBed.inject(ExtraUserInfoFormService);
    extraUserInfoService = TestBed.inject(ExtraUserInfoService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const extraUserInfo: IExtraUserInfo = { id: 456 };
      const user: IUser = { id: 14087 };
      extraUserInfo.user = user;

      const userCollection: IUser[] = [{ id: 9442 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ extraUserInfo });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const extraUserInfo: IExtraUserInfo = { id: 456 };
      const user: IUser = { id: 93378 };
      extraUserInfo.user = user;

      activatedRoute.data = of({ extraUserInfo });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.extraUserInfo).toEqual(extraUserInfo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExtraUserInfo>>();
      const extraUserInfo = { id: 123 };
      jest.spyOn(extraUserInfoFormService, 'getExtraUserInfo').mockReturnValue(extraUserInfo);
      jest.spyOn(extraUserInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extraUserInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: extraUserInfo }));
      saveSubject.complete();

      // THEN
      expect(extraUserInfoFormService.getExtraUserInfo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(extraUserInfoService.update).toHaveBeenCalledWith(expect.objectContaining(extraUserInfo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExtraUserInfo>>();
      const extraUserInfo = { id: 123 };
      jest.spyOn(extraUserInfoFormService, 'getExtraUserInfo').mockReturnValue({ id: null });
      jest.spyOn(extraUserInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extraUserInfo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: extraUserInfo }));
      saveSubject.complete();

      // THEN
      expect(extraUserInfoFormService.getExtraUserInfo).toHaveBeenCalled();
      expect(extraUserInfoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExtraUserInfo>>();
      const extraUserInfo = { id: 123 };
      jest.spyOn(extraUserInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extraUserInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(extraUserInfoService.update).toHaveBeenCalled();
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
