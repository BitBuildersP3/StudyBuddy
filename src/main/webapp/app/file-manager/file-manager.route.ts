import { Routes } from '@angular/router';

import { selectorTypeFileRoute } from './selector-type-file/selector-type-file.route';


const ACCOUNT_ROUTES = [
  selectorTypeFileRoute,

];

export const accountState: Routes = [
  {
    path: '',
    children: ACCOUNT_ROUTES,
  },
];
