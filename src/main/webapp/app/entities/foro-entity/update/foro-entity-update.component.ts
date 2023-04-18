import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ForoEntityFormService, ForoEntityFormGroup } from './foro-entity-form.service';
import { IForoEntity } from '../foro-entity.model';
import { ForoEntityService } from '../service/foro-entity.service';

@Component({
  selector: 'jhi-foro-entity-update',
  templateUrl: './foro-entity-update.component.html',
})
export class ForoEntityUpdateComponent implements OnInit {
  isSaving = false;
  foroEntity: IForoEntity | null = null;

  editForm: ForoEntityFormGroup = this.foroEntityFormService.createForoEntityFormGroup();

  constructor(
    protected foroEntityService: ForoEntityService,
    protected foroEntityFormService: ForoEntityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foroEntity }) => {
      this.foroEntity = foroEntity;
      if (foroEntity) {
        this.updateForm(foroEntity);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const foroEntity = this.foroEntityFormService.getForoEntity(this.editForm);
    if (foroEntity.id !== null) {
      this.subscribeToSaveResponse(this.foroEntityService.update(foroEntity));
    } else {
      this.subscribeToSaveResponse(this.foroEntityService.create(foroEntity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IForoEntity>>): void {
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

  protected updateForm(foroEntity: IForoEntity): void {
    this.foroEntity = foroEntity;
    this.foroEntityFormService.resetForm(this.editForm, foroEntity);
  }
}
