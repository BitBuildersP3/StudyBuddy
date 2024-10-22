import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITodoList } from '../todo-list.model';
import { TodoListService } from '../service/todo-list.service';

@Injectable({ providedIn: 'root' })
export class TodoListRoutingResolveService implements Resolve<ITodoList | null> {
  constructor(protected service: TodoListService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITodoList | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((todoList: HttpResponse<ITodoList>) => {
          if (todoList.body) {
            return of(todoList.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
