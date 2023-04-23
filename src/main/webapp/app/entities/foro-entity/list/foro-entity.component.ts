import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IForoEntity } from '../foro-entity.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ForoEntityService } from '../service/foro-entity.service';
import { ForoEntityDeleteDialogComponent } from '../delete/foro-entity-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-foro-entity',
  templateUrl: './foro-entity.component.html',
  styleUrls: ['./foro-entity.component.scss'],
})
export class ForoEntityComponent implements OnInit {
  foroEntities?: IForoEntity[];
  isLoading = false;
  filteredArray: any = [];
  predicate = 'id';
  ascending = true;

  constructor(
    protected foroEntityService: ForoEntityService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IForoEntity): string => this.foroEntityService.getForoEntityIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  approve(): void {
    Swal.fire({
      title: 'Aceptar petición',
      text: 'Ve al panel de administración externo para aceptar esta petición.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ir',
    }).then(result => {
      if (result.isConfirmed) {
        window.location.href = 'https://deadsimplechat.com/dashboard/chatrooms/edit/64361f7161110317821f9f1f/channels';
      }
    });
  }

  delete(foroEntity: any): void {
    Swal.fire({
      title: 'Aceptar petición',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!',
    }).then(result => {
      if (result.isConfirmed) {
        this.foroEntityService.delete(foroEntity.id).subscribe(() => {
          // console.log('delete' + id.toString());
        });
        Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          showConfirmButton: true,
        }).then(res => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    });
  }

  // delete(foroEntity: any): void {
  //   const modalRef = this.modalService.open(ForoEntityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
  //   modalRef.componentInstance.foroEntity = foroEntity;
  //   // unsubscribe not needed because closed completes on modal close
  //   modalRef.closed
  //     .pipe(
  //       filter(reason => reason === ITEM_DELETED_EVENT),
  //       switchMap(() => this.loadFromBackendWithRouteInformations())
  //     )
  //     .subscribe({
  //       next: (res: EntityArrayResponseType) => {
  //         this.onResponseSuccess(res);
  //         this.load();
  //       },
  //     });
  // }

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
    this.foroEntities = this.refineData(dataFromBody);
    this.foroEntities.map(value => {
      const splitVals = value.json?.split(',');
      // console.log(splitVals);
      // ['Nombre del usuario: user', 'Correo: email', 'Nombre del tema: test coma name', 'Proposito del tema: desc tema test'];
      const arrVals = {
        id: value.id,
        json: splitVals,
      };
      this.filteredArray.push(arrVals);
    });
  }

  protected refineData(data: IForoEntity[]): IForoEntity[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IForoEntity[] | null): IForoEntity[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.foroEntityService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
}
