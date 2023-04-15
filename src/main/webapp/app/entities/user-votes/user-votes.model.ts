export interface IUserVotes {
  id: number;
  idUser?: string | null;
  json?: string | null;
}

export type NewUserVotes = Omit<IUserVotes, 'id'> & { id: null };
