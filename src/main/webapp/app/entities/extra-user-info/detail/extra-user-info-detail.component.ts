import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExtraUserInfo } from '../extra-user-info.model';

@Component({
  selector: 'jhi-extra-user-info-detail',
  templateUrl: './extra-user-info-detail.component.html',
})
export class ExtraUserInfoDetailComponent implements OnInit {
  extraUserInfo: IExtraUserInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extraUserInfo }) => {
      this.extraUserInfo = extraUserInfo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
