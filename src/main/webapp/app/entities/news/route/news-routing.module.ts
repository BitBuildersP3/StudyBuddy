import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NewsComponent } from '../list/news.component';
import { NewsDetailComponent } from '../detail/news-detail.component';
import { NewsUpdateComponent } from '../update/news-update.component';
import { NewsRoutingResolveService } from './news-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const newsRoute: Routes = [
  {
    path: '',
    component: NewsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NewsDetailComponent,
    resolve: {
      news: NewsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NewsUpdateComponent,
    resolve: {
      news: NewsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NewsUpdateComponent,
    resolve: {
      news: NewsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(newsRoute)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
