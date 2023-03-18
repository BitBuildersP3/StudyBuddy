import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExtraUserInfoDetailComponent } from './extra-user-info-detail.component';

describe('ExtraUserInfo Management Detail Component', () => {
  let comp: ExtraUserInfoDetailComponent;
  let fixture: ComponentFixture<ExtraUserInfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtraUserInfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ extraUserInfo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExtraUserInfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExtraUserInfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load extraUserInfo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.extraUserInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
