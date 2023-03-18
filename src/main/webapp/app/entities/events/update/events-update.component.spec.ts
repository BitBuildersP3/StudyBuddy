import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventsFormService } from './events-form.service';
import { EventsService } from '../service/events.service';
import { IEvents } from '../events.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { EventsUpdateComponent } from './events-update.component';

describe('Events Management Update Component', () => {
  let comp: EventsUpdateComponent;
  let fixture: ComponentFixture<EventsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventsFormService: EventsFormService;
  let eventsService: EventsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EventsUpdateComponent],
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
      .overrideTemplate(EventsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventsFormService = TestBed.inject(EventsFormService);
    eventsService = TestBed.inject(EventsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const events: IEvents = { id: 456 };
      const user: IUser = { id: 23755 };
      events.user = user;

      const userCollection: IUser[] = [{ id: 86296 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ events });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const events: IEvents = { id: 456 };
      const user: IUser = { id: 1220 };
      events.user = user;

      activatedRoute.data = of({ events });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.events).toEqual(events);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvents>>();
      const events = { id: 123 };
      jest.spyOn(eventsFormService, 'getEvents').mockReturnValue(events);
      jest.spyOn(eventsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ events });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: events }));
      saveSubject.complete();

      // THEN
      expect(eventsFormService.getEvents).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventsService.update).toHaveBeenCalledWith(expect.objectContaining(events));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvents>>();
      const events = { id: 123 };
      jest.spyOn(eventsFormService, 'getEvents').mockReturnValue({ id: null });
      jest.spyOn(eventsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ events: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: events }));
      saveSubject.complete();

      // THEN
      expect(eventsFormService.getEvents).toHaveBeenCalled();
      expect(eventsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvents>>();
      const events = { id: 123 };
      jest.spyOn(eventsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ events });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventsService.update).toHaveBeenCalled();
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
