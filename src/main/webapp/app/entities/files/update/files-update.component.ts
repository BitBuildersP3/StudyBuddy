import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FilesFormService, FilesFormGroup } from './files-form.service';
import { IFiles } from '../files.model';
import { FilesService } from '../service/files.service';
import { ISection } from 'app/entities/section/section.model';
import { SectionService } from 'app/entities/section/service/section.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-files-update',
  templateUrl: './files-update.component.html',
  styleUrls: ['./files-update.component.scss'],
})
export class FilesUpdateComponent implements OnInit {
  isSaving = false;
  files: IFiles | null = null;

  sectionsSharedCollection: ISection[] = [];

  editForm: FilesFormGroup = this.filesFormService.createFilesFormGroup();

  typeFile: any | null = null;

  cloudURL: string = 'Crema';
  constructor(
    protected filesService: FilesService,
    protected filesFormService: FilesFormService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {}

  compareSection = (o1: ISection | null, o2: ISection | null): boolean => this.sectionService.compareSection(o1, o2);

  ngOnInit(): void {
    this.titleService.setTitle('Editar archivo');

    this.activatedRoute.data.subscribe(({ files }) => {
      this.files = files;
      if (files) {
        this.updateForm(files);
        this.typeFile = this.files?.type;
        console.log('EL TIPO ES:' + this.typeFile);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const files = this.filesFormService.getFiles(this.editForm);
    if (files.id !== null) {
      if (this.typeFile == 'own') {
        // Cambio de URL
        files.url1 = this.cloudURL;
      }

      this.subscribeToSaveResponse(this.filesService.update(files));
      Swal.fire({
        title: '¿Está seguro que desea modificar el archivo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí!',
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Modificado correctamente',
            showConfirmButton: true,
            timer: 3000,
          }).then(result => {
            if (result.isConfirmed) {
              this.previousState();
            }
          });
        }
      });
    } else {
      this.subscribeToSaveResponse(this.filesService.create(files));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFiles>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    //this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(files: IFiles): void {
    this.files = files;
    this.filesFormService.resetForm(this.editForm, files);

    this.sectionsSharedCollection = this.sectionService.addSectionToCollectionIfMissing<ISection>(
      this.sectionsSharedCollection,
      files.section
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sectionService
      .query()
      .pipe(map((res: HttpResponse<ISection[]>) => res.body ?? []))
      .pipe(map((sections: ISection[]) => this.sectionService.addSectionToCollectionIfMissing<ISection>(sections, this.files?.section)))
      .subscribe((sections: ISection[]) => (this.sectionsSharedCollection = sections));
  }

  myURLFromCloudinary(url: string) {
    console.log('URL a Guardar: ' + url);
    return (this.cloudURL = url);
  }
}
