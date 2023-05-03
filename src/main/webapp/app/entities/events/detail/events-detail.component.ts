import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { EntityResponseType } from 'app/entities/news/service/news.service';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';

import { IEvents } from '../events.model';
import { EventsService } from '../service/events.service';

@Component({
  selector: 'jhi-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.scss'],
})
export class EventsDetailComponent implements OnInit {
  events: IEvents | null = null;
  eve: IEvents | null = null;
  mostrarAtributos = false;

  mostrarEditar = false;

  isSaving = false;
  ownerName: string = '';

  actualUser: string = '';
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected eventsService: EventsService,
    protected extraUser: ExtraUserInfoService
  ) {}
  trackId = (_index: number, item: IEvents): number => this.eventsService.getEventsIdentifier(item);

  ngOnInit(): void {
    this.extraUser.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // @ts-ignore
        this.idUser = res.body?.user.id;
        const login = res.body?.user?.login;
        if (login != null) {
          this.ownerName = login;
          this.actualUser = login;
          console.log('yo soy el loging ' + login);
        }
        this.activatedRoute.data.subscribe(({ events }) => {
          this.events = events;
          this.showAtributes((this.events = events));
        });
      },
    });
  }

  showAtributes(idEvent: IEvents): void {
    const separator = '-';
    const searchData = this.ownerName;
    this.isSaving = true;
    if (idEvent.status == null) {
      idEvent.status = 'Pendiente';
    }
    if (idEvent.status.includes(searchData)) {
      this.mostrarAtributos = !this.mostrarAtributos;
      console.log('TE ESTOY BUSCANDO' + idEvent.status);
    }

    if (idEvent.user?.login == this.actualUser) {
      this.mostrarEditar = !this.mostrarEditar;
      console.log('TE ESTOY BUSCANDO' + idEvent.user);
    }

    console.log('Evento USER: ' + idEvent.user?.login);
    console.log('Evento USER: ' + this.actualUser);
  }

  previousState(): void {
    window.history.back();
  }
}
