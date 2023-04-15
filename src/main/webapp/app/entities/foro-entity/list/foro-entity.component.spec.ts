import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ForoEntityService } from '../service/foro-entity.service';

import { ForoEntityComponent } from './foro-entity.component';

describe('ForoEntity Management Component', () => {
  let comp: ForoEntityComponent;
  let fixture: ComponentFixture<ForoEntityComponent>;
  let service: ForoEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'foro-entity', component: ForoEntityComponent }]), HttpClientTestingModule],
      declarations: [ForoEntityComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ForoEntityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ForoEntityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ForoEntityService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.foroEntities?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to foroEntityService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getForoEntityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getForoEntityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
