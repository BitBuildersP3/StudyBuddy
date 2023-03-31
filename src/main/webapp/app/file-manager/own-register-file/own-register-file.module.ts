import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OwnRegisterFileComponent} from "./own-register-file.component";
import {VideoRegisterFileComponent} from "../video-register-file/video-register-file.component";
import {IndexRegisterFileComponent} from "../index-register-file/index-register-file.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";



@NgModule({
  declarations: [
    VideoRegisterFileComponent,
    IndexRegisterFileComponent,
    OwnRegisterFileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      // Define aquí las rutas hijas si se necesitan
    ]),
  ],
  exports: [
    VideoRegisterFileComponent,
    OwnRegisterFileComponent,
    IndexRegisterFileComponent,
  ],
})
export class OwnRegisterFileModule { }
