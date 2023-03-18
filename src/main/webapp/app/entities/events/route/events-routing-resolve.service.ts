import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvents } from '../events.model';
import { EventsService } from '../service/events.service';

@Injectable({ providedIn: 'root' })
export class EventsRoutingResolveService implements Resolve<IEvents | null> {
  constructor(protected service: EventsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEvents | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((events: HttpResponse<IEvents>) => {
          if (events.body) {
            return of(events.body);
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
