export interface ICourseVotes {
  id: number;
  idCourse?: number | null;
  json?: string | null;
}

export type NewCourseVotes = Omit<ICourseVotes, 'id'> & { id: null };
