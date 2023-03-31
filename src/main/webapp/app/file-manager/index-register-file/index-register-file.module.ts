import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IndexRegisterFileComponent} from "./index-register-file.component";
import {VideoRegisterFileComponent} from "../video-register-file/video-register-file.component";
import {OwnRegisterFileComponent} from "../own-register-file/own-register-file.component";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";


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
    IndexRegisterFileComponent,
    OwnRegisterFileComponent,
  ],
})
export class IndexRegisterFileModule { }
