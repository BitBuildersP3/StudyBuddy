import {Component, OnInit, ViewChild} from '@angular/core';
import {IFiles} from "../../entities/files/files.model";
import {ISection} from "../../entities/section/section.model";
import {FilesFormGroup, FilesFormService} from "../../entities/files/update/files-form.service";
import {FilesService} from "../../entities/files/service/files.service";
import {SectionService} from "../../entities/section/service/section.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {finalize, map} from "rxjs/operators";
import { AccountService } from 'app/core/auth/account.service';


import {
  EntityResponseType,
  ExtraUserInfoService,
  RestExtraUserInfo
} from "../../entities/extra-user-info/service/extra-user-info.service";


@Component({
  selector: 'jhi-index-register-file',
  templateUrl: './index-register-file.component.html',
  styleUrls: ['./index-register-file.component.scss']
})
export class IndexRegisterFileComponent implements OnInit {

  isSaving = false;
  files: IFiles | null = null;

  userId: any;
  sectionsSharedCollection: ISection[] = [];

  editForm: FilesFormGroup = this.filesFormService.createFilesFormGroup();



  constructor(
    protected filesService: FilesService,
    protected filesFormService: FilesFormService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,

    protected extraUserInfoService: ExtraUserInfoService,

  ) { }

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

          this.userId = res.body?.id;
          console.log("ID DE USUARIO",this.userId);

          
        },
      });


    });


  }


  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const files = this.filesFormService.getFiles(this.editForm);
    if (files.id !== null) {
      this.subscribeToSaveResponse(this.filesService.update(files));
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
    this.filesFormService.resetForm(this.editForm, files);

    // Se llena el dropdown de "Seccion" (Clase).
    this.sectionsSharedCollection = this.sectionService.addSectionToCollectionIfMissing<ISection>(
      this.sectionsSharedCollection,
      files.section
    );

    console.log("Aca el dato del sectionSSharedCollection",this.sectionsSharedCollection);
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
