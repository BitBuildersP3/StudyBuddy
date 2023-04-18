import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IForoEntity } from '../foro-entity.model';

@Component({
  selector: 'jhi-foro-entity-detail',
  templateUrl: './foro-entity-detail.component.html',
})
export class ForoEntityDetailComponent implements OnInit {
  foroEntity: IForoEntity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foroEntity }) => {
      this.foroEntity = foroEntity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
