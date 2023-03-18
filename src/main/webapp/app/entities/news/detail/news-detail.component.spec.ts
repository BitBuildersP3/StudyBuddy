import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NewsDetailComponent } from './news-detail.component';

describe('News Management Detail Component', () => {
  let comp: NewsDetailComponent;
  let fixture: ComponentFixture<NewsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ news: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NewsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NewsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load news on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.news).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
