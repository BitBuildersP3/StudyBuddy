import { Route } from '@angular/router';

import { LandingComponent } from './landing.component';

export const LANDING_ROUTE: Route = {
  path: '',
  component: LandingComponent,
  data: {
    pageTitle: 'Landing Page',
  },
};
