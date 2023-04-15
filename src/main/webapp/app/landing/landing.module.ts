import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { LandingComponent } from './landing.component';
import { LANDING_ROUTE } from './landing.routes';
import { CourseCarouselComponent } from './course-carousel/course-carousel.component';
import { FeaturesComponent } from './features/features.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';
import { InstructorsComponent } from './instructors/instructors.component';
import {ToolPomModule} from "../tool-pom/tool-pom/tool-pom.module";

@NgModule({
    imports: [SharedModule, RouterModule.forChild([LANDING_ROUTE]), ToolPomModule],
  declarations: [LandingComponent, CourseCarouselComponent, FeaturesComponent, AboutUsComponent, NewsComponent, InstructorsComponent],
})
export class LandingModule {}
