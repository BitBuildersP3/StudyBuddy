import { Route } from '@angular/router';

import { SelectorTypeFileComponent } from './selector-type-file.component';

export const SelectorTypeFileRoute: Route = {
  path: 'selectTypeFile',
  component: SelectorTypeFileComponent,
  data: {
    pageTitle: 'selectTypeFile.title',
  },
};
