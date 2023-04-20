import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EulaComponent} from "../eula.component";



@NgModule({
  declarations: [EulaComponent],
  imports: [
    CommonModule
  ],
  exports: [EulaComponent],
})
export class EulaModule { }
