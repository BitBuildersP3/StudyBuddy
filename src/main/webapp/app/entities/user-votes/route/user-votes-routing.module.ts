import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserVotesComponent } from '../list/user-votes.component';
import { UserVotesDetailComponent } from '../detail/user-votes-detail.component';
import { UserVotesUpdateComponent } from '../update/user-votes-update.component';
import { UserVotesRoutingResolveService } from './user-votes-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userVotesRoute: Routes = [
  {
    path: '',
    component: UserVotesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserVotesDetailComponent,
    resolve: {
      userVotes: UserVotesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserVotesUpdateComponent,
    resolve: {
      userVotes: UserVotesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserVotesUpdateComponent,
    resolve: {
      userVotes: UserVotesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userVotesRoute)],
  exports: [RouterModule],
})
export class UserVotesRoutingModule {}
