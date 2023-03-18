import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventsComponent } from './list/events.component';
import { EventsDetailComponent } from './detail/events-detail.component';
import { EventsUpdateComponent } from './update/events-update.component';
import { EventsDeleteDialogComponent } from './delete/events-delete-dialog.component';
import { EventsRoutingModule } from './route/events-routing.module';

@NgModule({
  imports: [SharedModule, EventsRoutingModule],
  declarations: [EventsComponent, EventsDetailComponent, EventsUpdateComponent, EventsDeleteDialogComponent],
})
export class EventsModule {}
