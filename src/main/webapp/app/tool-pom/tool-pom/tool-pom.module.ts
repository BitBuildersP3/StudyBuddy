import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolPomComponent} from "../tool-pom.component";



@NgModule({
  declarations: [ToolPomComponent],
  imports: [
    CommonModule],
  exports: [ToolPomComponent]
})
export class ToolPomModule { }
