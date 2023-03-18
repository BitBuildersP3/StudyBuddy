import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { INews, NewNews } from '../news.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INews for edit and NewNewsFormGroupInput for create.
 */
type NewsFormGroupInput = INews | PartialWithRequiredKeyOf<NewNews>;

type NewsFormDefaults = Pick<NewNews, 'id'>;

type NewsFormGroupContent = {
  id: FormControl<INews['id'] | NewNews['id']>;
  name: FormControl<INews['name']>;
  excerpt: FormControl<INews['excerpt']>;
  body: FormControl<INews['body']>;
  image: FormControl<INews['image']>;
  creationDate: FormControl<INews['creationDate']>;
  user: FormControl<INews['user']>;
};

export type NewsFormGroup = FormGroup<NewsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NewsFormService {
  createNewsFormGroup(news: NewsFormGroupInput = { id: null }): NewsFormGroup {
    const newsRawValue = {
      ...this.getFormDefaults(),
      ...news,
    };
    return new FormGroup<NewsFormGroupContent>({
      id: new FormControl(
        { value: newsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(newsRawValue.name),
      excerpt: new FormControl(newsRawValue.excerpt),
      body: new FormControl(newsRawValue.body),
      image: new FormControl(newsRawValue.image),
      creationDate: new FormControl(newsRawValue.creationDate),
      user: new FormControl(newsRawValue.user),
    });
  }

  getNews(form: NewsFormGroup): INews | NewNews {
    return form.getRawValue() as INews | NewNews;
  }

  resetForm(form: NewsFormGroup, news: NewsFormGroupInput): void {
    const newsRawValue = { ...this.getFormDefaults(), ...news };
    form.reset(
      {
        ...newsRawValue,
        id: { value: newsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NewsFormDefaults {
    return {
      id: null,
    };
  }
}
