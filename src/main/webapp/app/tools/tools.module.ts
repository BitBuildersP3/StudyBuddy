import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ToolsComponent } from './tools.component';
import { ToolPomModule } from 'app/tool-pom/tool-pom/tool-pom.module';
import { RouterModule } from '@angular/router';
import { TOOL_ROUTE } from './tools.routes';
import { TodoListModule } from 'app/entities/todo-list/todo-list.module';
@NgModule({
  imports: [SharedModule, RouterModule.forChild([TOOL_ROUTE]), ToolPomModule, TodoListModule],
  declarations: [ToolsComponent],
})
export class ToolsModule {}
