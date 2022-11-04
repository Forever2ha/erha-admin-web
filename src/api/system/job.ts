import axios from 'axios';

export interface Job {
  jobId: number;
  jobSort: number;
  enabled: boolean;
  createTime: string;
  name: string;
}

// eslint-disable-next-line import/prefer-default-export
export function getJobList() {
  return axios.get<Job[]>('/job/all');
}
