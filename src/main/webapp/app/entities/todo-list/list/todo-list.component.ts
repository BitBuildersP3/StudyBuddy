import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import { ITodoList } from '../todo-list.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, TodoListService } from '../service/todo-list.service';
import { TodoListDeleteDialogComponent } from '../delete/todo-list-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { EntityResponseType } from 'app/entities/news/service/news.service';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { TodoListFormGroup, TodoListFormService } from '../update/todo-list-form.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoListComponent implements OnInit {
  [x: string]: any;
  todoLists?: ITodoList[];
  isLoading = false;
  idUser: number = 0;
  ownerName: string;
  predicate = 'id';
  ascending = true;
  isSaving = false;
  status = '';
  isChecked = false;
  editForm: TodoListFormGroup = this.todoListFormService.createTodoListFormGroup();
  constructor(
    protected todoListService: TodoListService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,

    protected sortService: SortService,
    protected modalService: NgbModal,
    protected extraUser: ExtraUserInfoService,
    protected todoListFormService: TodoListFormService,
    private titleService: Title
  ) {
    this.ownerName = '';
  }

  trackId = (_index: number, item: ITodoList): number => this.todoListService.getTodoListIdentifier(item);

  ngOnInit(): void {
    this.titleService.setTitle('Lista de Tareas');

    this.extraUser.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // @ts-ignore
        this.idUser = res.body?.user.id;
        const login = res.body?.user?.login;
        if (login != null) {
          this.ownerName = login;
        }
        this.load();
      },
    });
  }

  save(): void {
    this.isSaving = true;
    const todoList = this.todoListFormService.getTodoList(this.editForm);
    if (todoList.id !== null) {
      todoList.status = 'done';
      this.isChecked = true;
      this.subscribeToSaveResponse(this.todoListService.update(todoList));
    } else {
      todoList.status = this.status = 'pendiente';
      todoList.priority = 1;
      todoList.user = { id: this.idUser, login: this.ownerName };
      this.subscribeToSaveResponse(this.todoListService.create(todoList));
    }
  }

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const todoList = this.todoListFormService.getTodoList(this.editForm);
    if (isChecked) {
      if (todoList.id !== null) {
        todoList.status = 'done';
        this.isChecked = true;
        this.subscribeToSaveResponse(this.todoListService.update(todoList));
      }
    } else {
      todoList.status = this.status = 'pendiente';
    }
  }

  previousState(): void {
    //window.history.back();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodoList>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    Swal.fire({
      icon: 'success',
      title: 'Creado Correctamente',
      showConfirmButton: true,
    });
    this.load();
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  delete(todoList: ITodoList): void {
    const modalRef = this.modalService.open(TodoListDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.todoList = todoList;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado Correctamente',
            showConfirmButton: true,
          });
          this.onResponseSuccess(res);
          this.load();
        },
      });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.todoLists = this.refineData(dataFromBody);
  }

  protected refineData(data: ITodoList[]): ITodoList[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ITodoList[] | null): ITodoList[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.todoListService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
