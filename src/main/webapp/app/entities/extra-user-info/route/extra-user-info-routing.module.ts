import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExtraUserInfoComponent } from '../list/extra-user-info.component';
import { ExtraUserInfoDetailComponent } from '../detail/extra-user-info-detail.component';
import { ExtraUserInfoUpdateComponent } from '../update/extra-user-info-update.component';
import { ExtraUserInfoRoutingResolveService } from './extra-user-info-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const extraUserInfoRoute: Routes = [
  {
    path: '',
    component: ExtraUserInfoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExtraUserInfoDetailComponent,
    resolve: {
      extraUserInfo: ExtraUserInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExtraUserInfoUpdateComponent,
    resolve: {
      extraUserInfo: ExtraUserInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExtraUserInfoUpdateComponent,
    resolve: {
      extraUserInfo: ExtraUserInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(extraUserInfoRoute)],
  exports: [RouterModule],
})
export class ExtraUserInfoRoutingModule {}
