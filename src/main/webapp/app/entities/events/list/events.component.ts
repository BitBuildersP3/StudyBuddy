import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntityResponseType } from 'app/entities/news/service/news.service';
import { IEvents } from '../events.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, EventsService } from '../service/events.service';
import { EventsDeleteDialogComponent } from '../delete/events-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { Title } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import Swal from 'sweetalert2';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'jhi-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  events?: IEvents[];
  isLoading = false;
  isSaving = false;
  ownerName: string = '';

  predicate = 'id';
  ascending = true;

  promptValue: string = '';
  constructor(
    protected eventsService: EventsService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private titleService: Title,
    protected extraUser: ExtraUserInfoService
  ) {}

  trackId = (_index: number, item: IEvents): number => this.eventsService.getEventsIdentifier(item);

  ngOnInit(): void {
    this.titleService.setTitle('Eventos');
    this.extraUser.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // @ts-ignore
        this.idUser = res.body?.user.id;
        const login = res.body?.user?.login;
        if (login != null) {
          this.ownerName = login;
          console.log(this.ownerName);
        }
        this.load();
      },
    });
  }
  // función para editar el evento y así "inscribirse al evento"
  updateAddedList(idEvent: IEvents): void {
    const separator = '-';
    const searchData = this.ownerName;
    this.isSaving = true;
    if (idEvent.status == null) {
      idEvent.status = 'Pendiente';
    }
    if (idEvent.status.includes(searchData)) {
      Swal.fire({
        icon: 'info',
        title: 'Usted ya se encuntra previamente instrito en este evento',
        showConfirmButton: true,
      });
    } else {
      idEvent.status = idEvent.status.concat('-', this.ownerName);
      this.subscribeToSaveResponse(this.eventsService.partialUpdate(idEvent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: e => this.onSaveError(e),
    });
  }

  previousState(): void {
    window.history.back();
  }

  protected onSaveSuccess(): void {
    Swal.fire({
      icon: 'success',
      title: 'Inscrito correctamente',
      showConfirmButton: true,
    });
  }

  protected onSaveError(e: any): void {
    Swal.fire({
      icon: 'success',
      title: 'Error',
      showDenyButton: true,
      denyButtonColor: '#6dabd5',
      confirmButtonText: 'Seguir Matriculando',
      denyButtonText: `Ir a mis cursos`,
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['courses']);
      } else if (result.isDenied) {
        this.router.navigate(['courses/enrolled']);
      }
    });
    console.log(e);
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  delete(events: IEvents): void {
    const modalRef = this.modalService.open(EventsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.events = events;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.events = this.refineData(dataFromBody);
  }

  protected refineData(data: IEvents[]): IEvents[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IEvents[] | null): IEvents[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.eventsService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  searchEvent() {
    console.log(this.promptValue);

    if (this.promptValue !== '') {
      this.eventsService.getEventsByPrompt(this.promptValue).subscribe({
        next: result => {
          this.onResponseSuccess(result);
        },
      });
    } else this.load();
  }
}
