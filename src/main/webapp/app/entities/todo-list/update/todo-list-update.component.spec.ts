import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TodoListFormService } from './todo-list-form.service';
import { TodoListService } from '../service/todo-list.service';
import { ITodoList } from '../todo-list.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TodoListUpdateComponent } from './todo-list-update.component';

describe('TodoList Management Update Component', () => {
  let comp: TodoListUpdateComponent;
  let fixture: ComponentFixture<TodoListUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let todoListFormService: TodoListFormService;
  let todoListService: TodoListService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TodoListUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TodoListUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoListUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    todoListFormService = TestBed.inject(TodoListFormService);
    todoListService = TestBed.inject(TodoListService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const todoList: ITodoList = { id: 456 };
      const user: IUser = { id: 96269 };
      todoList.user = user;

      const userCollection: IUser[] = [{ id: 9702 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todoList });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const todoList: ITodoList = { id: 456 };
      const user: IUser = { id: 67188 };
      todoList.user = user;

      activatedRoute.data = of({ todoList });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.todoList).toEqual(todoList);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodoList>>();
      const todoList = { id: 123 };
      jest.spyOn(todoListFormService, 'getTodoList').mockReturnValue(todoList);
      jest.spyOn(todoListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todoList }));
      saveSubject.complete();

      // THEN
      expect(todoListFormService.getTodoList).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(todoListService.update).toHaveBeenCalledWith(expect.objectContaining(todoList));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodoList>>();
      const todoList = { id: 123 };
      jest.spyOn(todoListFormService, 'getTodoList').mockReturnValue({ id: null });
      jest.spyOn(todoListService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoList: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todoList }));
      saveSubject.complete();

      // THEN
      expect(todoListFormService.getTodoList).toHaveBeenCalled();
      expect(todoListService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodoList>>();
      const todoList = { id: 123 };
      jest.spyOn(todoListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todoList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(todoListService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
