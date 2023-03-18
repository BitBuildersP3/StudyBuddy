import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PomodoroFormService } from './pomodoro-form.service';
import { PomodoroService } from '../service/pomodoro.service';
import { IPomodoro } from '../pomodoro.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { PomodoroUpdateComponent } from './pomodoro-update.component';

describe('Pomodoro Management Update Component', () => {
  let comp: PomodoroUpdateComponent;
  let fixture: ComponentFixture<PomodoroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pomodoroFormService: PomodoroFormService;
  let pomodoroService: PomodoroService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PomodoroUpdateComponent],
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
      .overrideTemplate(PomodoroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PomodoroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pomodoroFormService = TestBed.inject(PomodoroFormService);
    pomodoroService = TestBed.inject(PomodoroService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const pomodoro: IPomodoro = { id: 456 };
      const user: IUser = { id: 67011 };
      pomodoro.user = user;

      const userCollection: IUser[] = [{ id: 11535 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pomodoro });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pomodoro: IPomodoro = { id: 456 };
      const user: IUser = { id: 10391 };
      pomodoro.user = user;

      activatedRoute.data = of({ pomodoro });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.pomodoro).toEqual(pomodoro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoro>>();
      const pomodoro = { id: 123 };
      jest.spyOn(pomodoroFormService, 'getPomodoro').mockReturnValue(pomodoro);
      jest.spyOn(pomodoroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pomodoro }));
      saveSubject.complete();

      // THEN
      expect(pomodoroFormService.getPomodoro).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pomodoroService.update).toHaveBeenCalledWith(expect.objectContaining(pomodoro));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoro>>();
      const pomodoro = { id: 123 };
      jest.spyOn(pomodoroFormService, 'getPomodoro').mockReturnValue({ id: null });
      jest.spyOn(pomodoroService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoro: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pomodoro }));
      saveSubject.complete();

      // THEN
      expect(pomodoroFormService.getPomodoro).toHaveBeenCalled();
      expect(pomodoroService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoro>>();
      const pomodoro = { id: 123 };
      jest.spyOn(pomodoroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pomodoroService.update).toHaveBeenCalled();
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
