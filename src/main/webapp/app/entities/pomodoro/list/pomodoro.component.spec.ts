import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PomodoroService } from '../service/pomodoro.service';

import { PomodoroComponent } from './pomodoro.component';

describe('Pomodoro Management Component', () => {
  let comp: PomodoroComponent;
  let fixture: ComponentFixture<PomodoroComponent>;
  let service: PomodoroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pomodoro', component: PomodoroComponent }]), HttpClientTestingModule],
      declarations: [PomodoroComponent],
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
      .overrideTemplate(PomodoroComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PomodoroComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PomodoroService);

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
    expect(comp.pomodoros?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pomodoroService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPomodoroIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPomodoroIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
