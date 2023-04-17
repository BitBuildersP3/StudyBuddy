import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserVotesFormService } from './user-votes-form.service';
import { UserVotesService } from '../service/user-votes.service';
import { IUserVotes } from '../user-votes.model';

import { UserVotesUpdateComponent } from './user-votes-update.component';

describe('UserVotes Management Update Component', () => {
  let comp: UserVotesUpdateComponent;
  let fixture: ComponentFixture<UserVotesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userVotesFormService: UserVotesFormService;
  let userVotesService: UserVotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserVotesUpdateComponent],
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
      .overrideTemplate(UserVotesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserVotesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userVotesFormService = TestBed.inject(UserVotesFormService);
    userVotesService = TestBed.inject(UserVotesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userVotes: IUserVotes = { id: 456 };

      activatedRoute.data = of({ userVotes });
      comp.ngOnInit();

      expect(comp.userVotes).toEqual(userVotes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserVotes>>();
      const userVotes = { id: 123 };
      jest.spyOn(userVotesFormService, 'getUserVotes').mockReturnValue(userVotes);
      jest.spyOn(userVotesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userVotes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userVotes }));
      saveSubject.complete();

      // THEN
      expect(userVotesFormService.getUserVotes).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userVotesService.update).toHaveBeenCalledWith(expect.objectContaining(userVotes));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserVotes>>();
      const userVotes = { id: 123 };
      jest.spyOn(userVotesFormService, 'getUserVotes').mockReturnValue({ id: null });
      jest.spyOn(userVotesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userVotes: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userVotes }));
      saveSubject.complete();

      // THEN
      expect(userVotesFormService.getUserVotes).toHaveBeenCalled();
      expect(userVotesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserVotes>>();
      const userVotes = { id: 123 };
      jest.spyOn(userVotesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userVotes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userVotesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
