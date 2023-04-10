import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFiles } from '../files.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-files-detail',
  templateUrl: './files-detail.component.html',
  styleUrls: ['./files-detail.component.scss'],
})
export class FilesDetailComponent implements OnInit {
  files: IFiles | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Detalle del Archivo');

    this.activatedRoute.data.subscribe(({ files }) => {
      this.files = files;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
