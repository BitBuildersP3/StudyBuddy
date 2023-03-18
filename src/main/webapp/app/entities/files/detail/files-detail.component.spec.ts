import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FilesDetailComponent } from './files-detail.component';

describe('Files Management Detail Component', () => {
  let comp: FilesDetailComponent;
  let fixture: ComponentFixture<FilesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ files: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FilesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FilesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load files on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.files).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
