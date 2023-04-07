import { Component, Input, OnInit } from '@angular/core';
import { IFiles } from '../../entities/files/files.model';
import { ISection } from '../../entities/section/section.model';
import { FilesFormGroup } from './own-register-file.service';
import { FilesService } from '../../entities/files/service/files.service';
import { SectionService } from '../../entities/section/service/section.service';
import { ActivatedRoute } from '@angular/router';
import { EntityResponseType, ExtraUserInfoService } from '../../entities/extra-user-info/service/extra-user-info.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { OwnRegisterFileService } from './own-register-file.service';

@Component({
  selector: 'jhi-own-register-file',
  templateUrl: './own-register-file.component.html',
  styleUrls: ['./own-register-file.component.scss'],
})
export class OwnRegisterFileComponent implements OnInit {
  @Input() idSection: any;
  @Input() idCourse: any;

  isSaving = false;
  files: IFiles | null = null;

  userId: number | undefined;
  sectionsSharedCollection: ISection[] = [];

  cloudURL: string = 'No se ha subido un archivo';

  // Ajustar Servicio
  editForm: FilesFormGroup = this.OwnFormService.createFilesFormGroup();
  constructor(
    protected filesService: FilesService,
    protected OwnFormService: OwnRegisterFileService,
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
    const files = this.OwnFormService.getFiles(this.editForm);

    // Se modifico para quemar dos valores.
    if (files.id !== null) {
      this.subscribeToSaveResponse(this.filesService.update(files));
    } else {
      // Si no se a subido archivo.
      if (this.cloudURL != 'No se ha subido un archivo') {
        // Parametros QUEMADOS
        files.status = 'ACTIVE';
        files.type = 'own';
        files.url1 = this.cloudURL;
        files.url2 = 'NO URL 2';
        files.url3 = 'NO URL 3';
        files.section = { id: this.idSection };

        this.subscribeToSaveResponse(this.filesService.create(files));
      } else {
        // Poner una Alerta AQUI
      }
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFiles>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
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
    this.OwnFormService.resetForm(this.editForm, files);

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

  // Funcion de prueba para el boton de cloudinary
  myURLFromCloudinary(url: string) {
    console.log('URL a Guardar: ' + url);
    return (this.cloudURL = url);
  }
}
