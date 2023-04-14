import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IForoEntity } from '../foro-entity.model';
import { ForoEntityService } from '../service/foro-entity.service';

@Injectable({ providedIn: 'root' })
export class ForoEntityRoutingResolveService implements Resolve<IForoEntity | null> {
  constructor(protected service: ForoEntityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IForoEntity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((foroEntity: HttpResponse<IForoEntity>) => {
          if (foroEntity.body) {
            return of(foroEntity.body);
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
