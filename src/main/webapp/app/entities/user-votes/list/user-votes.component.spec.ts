import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserVotesService } from '../service/user-votes.service';

import { UserVotesComponent } from './user-votes.component';

describe('UserVotes Management Component', () => {
  let comp: UserVotesComponent;
  let fixture: ComponentFixture<UserVotesComponent>;
  let service: UserVotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-votes', component: UserVotesComponent }]), HttpClientTestingModule],
      declarations: [UserVotesComponent],
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
      .overrideTemplate(UserVotesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserVotesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserVotesService);

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
    expect(comp.userVotes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userVotesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserVotesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserVotesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
