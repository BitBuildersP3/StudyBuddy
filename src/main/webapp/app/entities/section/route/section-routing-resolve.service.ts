import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISection } from '../section.model';
import { SectionService } from '../service/section.service';

@Injectable({ providedIn: 'root' })
export class SectionRoutingResolveService implements Resolve<ISection | null> {
  constructor(protected service: SectionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISection | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((section: HttpResponse<ISection>) => {
          if (section.body) {
            return of(section.body);
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
