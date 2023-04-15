import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserVotes } from '../user-votes.model';
import { UserVotesService } from '../service/user-votes.service';

@Injectable({ providedIn: 'root' })
export class UserVotesRoutingResolveService implements Resolve<IUserVotes | null> {
  constructor(protected service: UserVotesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserVotes | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userVotes: HttpResponse<IUserVotes>) => {
          if (userVotes.body) {
            return of(userVotes.body);
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
