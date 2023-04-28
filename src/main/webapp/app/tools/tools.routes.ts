import { Route } from '@angular/router';
import { ToolsComponent } from './tools.component';

export const TOOL_ROUTE: Route = {
  path: '',
  component: ToolsComponent,
  data: {
    pageTitle: 'Tools',
  },
};
