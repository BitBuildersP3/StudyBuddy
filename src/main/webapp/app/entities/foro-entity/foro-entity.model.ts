export interface IForoEntity {
  id: string;
  json?: string | null;
}

export type NewForoEntity = Omit<IForoEntity, 'id'> & { id: null };
