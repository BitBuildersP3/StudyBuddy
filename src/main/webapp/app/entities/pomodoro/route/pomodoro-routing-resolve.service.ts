import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPomodoro } from '../pomodoro.model';
import { PomodoroService } from '../service/pomodoro.service';

@Injectable({ providedIn: 'root' })
export class PomodoroRoutingResolveService implements Resolve<IPomodoro | null> {
  constructor(protected service: PomodoroService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPomodoro | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pomodoro: HttpResponse<IPomodoro>) => {
          if (pomodoro.body) {
            return of(pomodoro.body);
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
