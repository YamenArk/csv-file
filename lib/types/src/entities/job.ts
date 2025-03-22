export interface JobEntity {
  id: number;
  status: 'pending' | 'success'|'failed';
  fileName: string | null;
  createdAt: Date;
}

