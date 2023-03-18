import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExtraUserInfoService } from '../service/extra-user-info.service';

import { ExtraUserInfoComponent } from './extra-user-info.component';

describe('ExtraUserInfo Management Component', () => {
  let comp: ExtraUserInfoComponent;
  let fixture: ComponentFixture<ExtraUserInfoComponent>;
  let service: ExtraUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'extra-user-info', component: ExtraUserInfoComponent }]), HttpClientTestingModule],
      declarations: [ExtraUserInfoComponent],
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
      .overrideTemplate(ExtraUserInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExtraUserInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExtraUserInfoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
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
    expect(comp.extraUserInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to extraUserInfoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExtraUserInfoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExtraUserInfoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
