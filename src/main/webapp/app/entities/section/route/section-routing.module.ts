import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SectionComponent } from '../list/section.component';
import { SectionDetailComponent } from '../detail/section-detail.component';
import { SectionUpdateComponent } from '../update/section-update.component';
import { SectionRoutingResolveService } from './section-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sectionRoute: Routes = [
  {
    path: '',
    component: SectionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SectionDetailComponent,
    resolve: {
      section: SectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SectionUpdateComponent,
    resolve: {
      section: SectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SectionUpdateComponent,
    resolve: {
      section: SectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sectionRoute)],
  exports: [RouterModule],
})
export class SectionRoutingModule {}
