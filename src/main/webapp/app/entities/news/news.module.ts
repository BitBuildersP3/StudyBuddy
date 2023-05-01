import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NewsComponent } from './list/news.component';
import { NewsDetailComponent } from './detail/news-detail.component';
import { NewsUpdateComponent } from './update/news-update.component';
import { NewsDeleteDialogComponent } from './delete/news-delete-dialog.component';
import { NewsRoutingModule } from './route/news-routing.module';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [SharedModule, NewsRoutingModule],
  declarations: [NewsComponent, NewsDetailComponent, NewsUpdateComponent, NewsDeleteDialogComponent],
  providers: [DatePipe],
  exports: [NewsDetailComponent],
})
export class NewsModule {}
