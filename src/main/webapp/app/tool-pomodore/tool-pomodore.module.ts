import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolPomodoreComponent } from './tool-pomodore.component';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [ToolPomodoreComponent],
  imports: [
    CommonModule, FormsModule, SharedModule
  ],
  exports: [ToolPomodoreComponent],
})
export class ToolPomodoreModule { }
