import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ForoEntityComponent } from '../list/foro-entity.component';
import { ForoEntityDetailComponent } from '../detail/foro-entity-detail.component';
import { ForoEntityUpdateComponent } from '../update/foro-entity-update.component';
import { ForoEntityRoutingResolveService } from './foro-entity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const foroEntityRoute: Routes = [
  {
    path: '',
    component: ForoEntityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ForoEntityDetailComponent,
    resolve: {
      foroEntity: ForoEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ForoEntityUpdateComponent,
    resolve: {
      foroEntity: ForoEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ForoEntityUpdateComponent,
    resolve: {
      foroEntity: ForoEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(foroEntityRoute)],
  exports: [RouterModule],
})
export class ForoEntityRoutingModule {}
