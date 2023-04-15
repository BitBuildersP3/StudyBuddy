import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ForoEntityFormService } from './foro-entity-form.service';
import { ForoEntityService } from '../service/foro-entity.service';
import { IForoEntity } from '../foro-entity.model';

import { ForoEntityUpdateComponent } from './foro-entity-update.component';

describe('ForoEntity Management Update Component', () => {
  let comp: ForoEntityUpdateComponent;
  let fixture: ComponentFixture<ForoEntityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let foroEntityFormService: ForoEntityFormService;
  let foroEntityService: ForoEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ForoEntityUpdateComponent],
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
      .overrideTemplate(ForoEntityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ForoEntityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    foroEntityFormService = TestBed.inject(ForoEntityFormService);
    foroEntityService = TestBed.inject(ForoEntityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const foroEntity: IForoEntity = { id: 'CBA' };

      activatedRoute.data = of({ foroEntity });
      comp.ngOnInit();

      expect(comp.foroEntity).toEqual(foroEntity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IForoEntity>>();
      const foroEntity = { id: 'ABC' };
      jest.spyOn(foroEntityFormService, 'getForoEntity').mockReturnValue(foroEntity);
      jest.spyOn(foroEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foroEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foroEntity }));
      saveSubject.complete();

      // THEN
      expect(foroEntityFormService.getForoEntity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(foroEntityService.update).toHaveBeenCalledWith(expect.objectContaining(foroEntity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IForoEntity>>();
      const foroEntity = { id: 'ABC' };
      jest.spyOn(foroEntityFormService, 'getForoEntity').mockReturnValue({ id: null });
      jest.spyOn(foroEntityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foroEntity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: foroEntity }));
      saveSubject.complete();

      // THEN
      expect(foroEntityFormService.getForoEntity).toHaveBeenCalled();
      expect(foroEntityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IForoEntity>>();
      const foroEntity = { id: 'ABC' };
      jest.spyOn(foroEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ foroEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(foroEntityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
