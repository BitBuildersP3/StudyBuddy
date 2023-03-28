import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { LandingComponent } from './landing.component';
import { LANDING_ROUTE } from './landing.routes';
import { CourseCarouselComponent } from './course-carousel/course-carousel.component';
import { FeaturesComponent } from './features/features.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([LANDING_ROUTE])],
  declarations: [LandingComponent, CourseCarouselComponent, FeaturesComponent, AboutUsComponent, NewsComponent],
})
export class LandingModule {}
