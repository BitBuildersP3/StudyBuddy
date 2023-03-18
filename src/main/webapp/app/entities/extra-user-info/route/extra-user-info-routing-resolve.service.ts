import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExtraUserInfo } from '../extra-user-info.model';
import { ExtraUserInfoService } from '../service/extra-user-info.service';

@Injectable({ providedIn: 'root' })
export class ExtraUserInfoRoutingResolveService implements Resolve<IExtraUserInfo | null> {
  constructor(protected service: ExtraUserInfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExtraUserInfo | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((extraUserInfo: HttpResponse<IExtraUserInfo>) => {
          if (extraUserInfo.body) {
            return of(extraUserInfo.body);
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
