import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFiles } from '../files.model';

@Component({
  selector: 'jhi-files-detail',
  templateUrl: './files-detail.component.html',
})
export class FilesDetailComponent implements OnInit {
  files: IFiles | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ files }) => {
      this.files = files;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
