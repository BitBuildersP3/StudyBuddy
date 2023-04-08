import { Component, Input, OnInit } from '@angular/core';
import { IFiles } from '../../entities/files/files.model';
import { ISection } from '../../entities/section/section.model';
// Recordar modificar el form group aca
import { FilesFormGroup } from '../video-register-file/video-register-file.service';
import { FilesService } from '../../entities/files/service/files.service';
import { SectionService } from '../../entities/section/service/section.service';
import { ActivatedRoute } from '@angular/router';
import { EntityResponseType, ExtraUserInfoService } from '../../entities/extra-user-info/service/extra-user-info.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { VideoRegisterFileService } from './video-register-file.service';

@Component({
  selector: 'jhi-video-register-file',
  templateUrl: './video-register-file.component.html',
  styleUrls: ['./video-register-file.component.scss'],
})
export class VideoRegisterFileComponent implements OnInit {
  @Input() idSection: any;
  @Input() idCourse: any;

  isSaving = false;
  files: IFiles | null = null;

  userId: number | undefined;
  sectionsSharedCollection: ISection[] = [];

  // Ajustar Servicio
  editForm: FilesFormGroup = this.VideoFormService.createFilesFormGroup();

  constructor(
    protected filesService: FilesService,
    protected VideoFormService: VideoRegisterFileService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,

    protected extraUserInfoService: ExtraUserInfoService
  ) {}

  compareSection = (o1: ISection | null, o2: ISection | null): boolean => this.sectionService.compareSection(o1, o2);
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ files }) => {
      this.files = files;
      if (files) {
        this.updateForm(files);
      }

      this.loadRelationshipsOptions();

      this.extraUserInfoService.getInfoByCurrentUser().subscribe({
        next: (res: EntityResponseType) => {
          // Adquiere Usuario
          if (res.body?.user?.id != null) {
            this.userId = res.body?.user.id;
          } else {
          }

          console.log('ID DE USUARIO', this.userId);
        },
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const files = this.VideoFormService.getFiles(this.editForm);

    // Se modifico para quemar dos valores.
    if (files.id !== null) {
      this.subscribeToSaveResponse(this.filesService.update(files));
    } else {
      // Parametros QUEMADOS
      files.status = 'ACTIVO';
      files.type = 'video';
      files.url2 = 'NO URL 2';
      files.url3 = 'NO URL 3';
      files.section = { id: this.idSection };

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
    Swal.fire({
      icon: 'success',
      title: 'Guardado correctamente',
      showConfirmButton: false,
      timer: 3000,
    });

    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(files: IFiles): void {
    this.files = files;
    this.VideoFormService.resetForm(this.editForm, files);

    // Se llena el dropdown de "Seccion" (Clase).
    this.sectionsSharedCollection = this.sectionService.addSectionToCollectionIfMissing<ISection>(
      this.sectionsSharedCollection,
      files.section
    );

    console.log('Aca el dato del sectionSSharedCollection', this.sectionsSharedCollection);
  }

  protected loadRelationshipsOptions(): void {
    // Servicio del SectionService
    this.sectionService

      .query()
      .pipe(map((res: HttpResponse<ISection[]>) => res.body ?? []))
      .pipe(map((sections: ISection[]) => this.sectionService.addSectionToCollectionIfMissing<ISection>(sections, this.files?.section)))
      .subscribe((sections: ISection[]) => (this.sectionsSharedCollection = sections));
  }
}
