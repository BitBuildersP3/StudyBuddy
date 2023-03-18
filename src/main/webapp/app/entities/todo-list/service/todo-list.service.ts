import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITodoList, NewTodoList } from '../todo-list.model';

export type PartialUpdateTodoList = Partial<ITodoList> & Pick<ITodoList, 'id'>;

export type EntityResponseType = HttpResponse<ITodoList>;
export type EntityArrayResponseType = HttpResponse<ITodoList[]>;

@Injectable({ providedIn: 'root' })
export class TodoListService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/todo-lists');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(todoList: NewTodoList): Observable<EntityResponseType> {
    return this.http.post<ITodoList>(this.resourceUrl, todoList, { observe: 'response' });
  }

  update(todoList: ITodoList): Observable<EntityResponseType> {
    return this.http.put<ITodoList>(`${this.resourceUrl}/${this.getTodoListIdentifier(todoList)}`, todoList, { observe: 'response' });
  }

  partialUpdate(todoList: PartialUpdateTodoList): Observable<EntityResponseType> {
    return this.http.patch<ITodoList>(`${this.resourceUrl}/${this.getTodoListIdentifier(todoList)}`, todoList, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITodoList>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITodoList[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTodoListIdentifier(todoList: Pick<ITodoList, 'id'>): number {
    return todoList.id;
  }

  compareTodoList(o1: Pick<ITodoList, 'id'> | null, o2: Pick<ITodoList, 'id'> | null): boolean {
    return o1 && o2 ? this.getTodoListIdentifier(o1) === this.getTodoListIdentifier(o2) : o1 === o2;
  }

  addTodoListToCollectionIfMissing<Type extends Pick<ITodoList, 'id'>>(
    todoListCollection: Type[],
    ...todoListsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const todoLists: Type[] = todoListsToCheck.filter(isPresent);
    if (todoLists.length > 0) {
      const todoListCollectionIdentifiers = todoListCollection.map(todoListItem => this.getTodoListIdentifier(todoListItem)!);
      const todoListsToAdd = todoLists.filter(todoListItem => {
        const todoListIdentifier = this.getTodoListIdentifier(todoListItem);
        if (todoListCollectionIdentifiers.includes(todoListIdentifier)) {
          return false;
        }
        todoListCollectionIdentifiers.push(todoListIdentifier);
        return true;
      });
      return [...todoListsToAdd, ...todoListCollection];
    }
    return todoListCollection;
  }
}
