import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SectionDetailComponent } from './section-detail.component';

describe('Section Management Detail Component', () => {
  let comp: SectionDetailComponent;
  let fixture: ComponentFixture<SectionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ section: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SectionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SectionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load section on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.section).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
