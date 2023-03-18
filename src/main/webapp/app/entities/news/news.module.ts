import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NewsComponent } from './list/news.component';
import { NewsDetailComponent } from './detail/news-detail.component';
import { NewsUpdateComponent } from './update/news-update.component';
import { NewsDeleteDialogComponent } from './delete/news-delete-dialog.component';
import { NewsRoutingModule } from './route/news-routing.module';

@NgModule({
  imports: [SharedModule, NewsRoutingModule],
  declarations: [NewsComponent, NewsDetailComponent, NewsUpdateComponent, NewsDeleteDialogComponent],
})
export class NewsModule {}
