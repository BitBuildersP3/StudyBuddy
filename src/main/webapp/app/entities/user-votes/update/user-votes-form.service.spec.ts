import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-votes.test-samples';

import { UserVotesFormService } from './user-votes-form.service';

describe('UserVotes Form Service', () => {
  let service: UserVotesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserVotesFormService);
  });

  describe('Service methods', () => {
    describe('createUserVotesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserVotesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            idUser: expect.any(Object),
            json: expect.any(Object),
          })
        );
      });

      it('passing IUserVotes should create a new form with FormGroup', () => {
        const formGroup = service.createUserVotesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            idUser: expect.any(Object),
            json: expect.any(Object),
          })
        );
      });
    });

    describe('getUserVotes', () => {
      it('should return NewUserVotes for default UserVotes initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserVotesFormGroup(sampleWithNewData);

        const userVotes = service.getUserVotes(formGroup) as any;

        expect(userVotes).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserVotes for empty UserVotes initial value', () => {
        const formGroup = service.createUserVotesFormGroup();

        const userVotes = service.getUserVotes(formGroup) as any;

        expect(userVotes).toMatchObject({});
      });

      it('should return IUserVotes', () => {
        const formGroup = service.createUserVotesFormGroup(sampleWithRequiredData);

        const userVotes = service.getUserVotes(formGroup) as any;

        expect(userVotes).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserVotes should not enable id FormControl', () => {
        const formGroup = service.createUserVotesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserVotes should disable id FormControl', () => {
        const formGroup = service.createUserVotesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
