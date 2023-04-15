import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ForoEntityDetailComponent } from './foro-entity-detail.component';

describe('ForoEntity Management Detail Component', () => {
  let comp: ForoEntityDetailComponent;
  let fixture: ComponentFixture<ForoEntityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForoEntityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ foroEntity: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(ForoEntityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ForoEntityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load foroEntity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.foroEntity).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
