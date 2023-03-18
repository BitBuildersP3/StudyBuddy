import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TodoListService } from '../service/todo-list.service';

import { TodoListComponent } from './todo-list.component';

describe('TodoList Management Component', () => {
  let comp: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let service: TodoListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'todo-list', component: TodoListComponent }]), HttpClientTestingModule],
      declarations: [TodoListComponent],
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
      .overrideTemplate(TodoListComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TodoListService);

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
    expect(comp.todoLists?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to todoListService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTodoListIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTodoListIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
