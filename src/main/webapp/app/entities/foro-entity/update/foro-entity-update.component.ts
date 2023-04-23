import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ForoEntityFormService, ForoEntityFormGroup } from './foro-entity-form.service';
import { IForoEntity } from '../foro-entity.model';
import { ForoEntityService } from '../service/foro-entity.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'jhi-foro-entity-update',
  templateUrl: './foro-entity-update.component.html',
})
export class ForoEntityUpdateComponent implements OnInit {
  isSaving = false;
  foroEntity: IForoEntity | null = null;

  // editForm: ForoEntityFormGroup = this.foroEntityFormService.createForoEntityFormGroup();
  currentUser: any = {};
  foroEntityForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    purpose: ['', [Validators.required, Validators.maxLength(255)]],
  });

  constructor(
    protected foroEntityService: ForoEntityService,
    protected foroEntityFormService: ForoEntityFormService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private extraUserService: ExtraUserInfoService
  ) {}

  ngOnInit(): void {
    this.extraUserService.getInfoByCurrentUser().subscribe(result => {
      this.currentUser = result.body;
      console.log(this.currentUser);
    });
  }
  // this.activatedRoute.data.subscribe(({ foroEntity }) => {
  //   this.foroEntity = foroEntity;
  //   if (foroEntity) {
  //     this.updateForm(foroEntity);
  //   }
  // });

  previousState(): void {
    window.history.back();
  }

  save(): void {
    if (this.foroEntityForm.valid) {
      const obj = {
        id: this.generateRandomId(),
        json: `Nombre del usuario: ${this.currentUser.user.login},Correo: ${this.currentUser.user.email},Nombre del tema: ${this.foroEntityForm.value.name},Proposito del tema: ${this.foroEntityForm.value.purpose}`,
      };
      this.isSaving = true;

      console.log(obj);

      // this.subscribeToSaveResponse(this.foroEntityService.create(obj));

      // console.log(obj);

      // this.isSaving = true;
      // const foroEntity = this.foroEntityFormService.getForoEntity(this.editForm);
      // if (foroEntity.id !== null) {
      //   this.subscribeToSaveResponse(this.foroEntityService.update(foroEntity));
      // } else {
      //   this.subscribeToSaveResponse(this.foroEntityService.create(foroEntity));
      // }
    }
  }
  showSwall(): void {
    Swal.fire({
      icon: 'success',
      title: 'Solicitud enviada con éxito',
      showConfirmButton: true,
    }).then(result => {
      this.foroEntityForm.reset();
    });
  }
  generateRandomId(): string {
    const length = 12;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IForoEntity>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.showSwall();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(foroEntity: IForoEntity): void {
    // this.foroEntity = foroEntity;
    // this.foroEntityFormService.resetForm(this.editForm, foroEntity);
  }
}
