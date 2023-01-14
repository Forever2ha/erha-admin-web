import axios from 'axios';

export interface ToolEmailConfig {
  fromUser: string;
  host: string;
  pass: string;
  port: string;
  user: string;
}
export function activeEmailCfg(id: number) {
  return axios.post(`/tools/email/config/active/${id}`);
}

export function sendEmail(data: any) {
  return axios.post('/tools/email', data);
}
