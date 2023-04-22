import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolPomComponent } from '../tool-pom.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ToolPomComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [ToolPomComponent],
})
export class ToolPomModule {}
