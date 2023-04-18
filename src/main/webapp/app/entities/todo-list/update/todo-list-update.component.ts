import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import { TodoListFormService, TodoListFormGroup } from './todo-list-form.service';
import { ITodoList } from '../todo-list.model';
import { TodoListService } from '../service/todo-list.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { EntityResponseType } from 'app/entities/news/service/news.service';
@Component({
  selector: 'jhi-todo-list-update',
  templateUrl: './todo-list-update.component.html',
})
export class TodoListUpdateComponent implements OnInit {
  isSaving = false;
  todoList: ITodoList | null = null;
  status = '';
  usersSharedCollection: IUser[] = [];
  idUser: number = 0;
  ownerName: string;
  editForm: TodoListFormGroup = this.todoListFormService.createTodoListFormGroup();

  constructor(
    protected todoListService: TodoListService,
    protected todoListFormService: TodoListFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected extraUser: ExtraUserInfoService
  ) {
    this.ownerName = '';
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todoList }) => {
      this.todoList = todoList;
      if (todoList) {
        this.updateForm(todoList);
      }

      this.loadRelationshipsOptions();
    });
    this.extraUser.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // @ts-ignore
        this.idUser = res.body?.user.id;
        const login = res.body?.user?.login;
        if (login != null) {
        }
      },
    });
  }

  previousState(): void {
    window.history.back();
  }

  myTask(idTask: ITodoList): void {
    if (idTask.id !== null) {
      //idTask.user?.push({ id: this.idUser, login: this.ownerName });
      idTask.user && (idTask.user = { id: this.idUser, login: this.ownerName });
      this.subscribeToSaveResponse(this.todoListService.update(idTask));
    }
  }

  save(): void {
    this.isSaving = true;
    const todoList = this.todoListFormService.getTodoList(this.editForm);
    if (todoList.id !== null) {
      this.subscribeToSaveResponse(this.todoListService.update(todoList));
    } else {
      todoList.status = this.status = 'pendiente';
      todoList.priority = 1;
      todoList.user = { id: this.idUser, login: this.ownerName };
      this.subscribeToSaveResponse(this.todoListService.create(todoList));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodoList>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(todoList: ITodoList): void {
    this.todoList = todoList;
    this.todoListFormService.resetForm(this.editForm, todoList);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, todoList.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.todoList?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
