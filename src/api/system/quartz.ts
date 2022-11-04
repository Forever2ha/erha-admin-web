import { BaseField } from '@/api/baseType';

export interface Quartz extends BaseField {
  id: number;
  beanName: string;
  cronExpression: string;
  isPause: boolean;
  jobName: string;
  methodName: string;
  params: string;
  description: string;
  personInCharge: string;
  email: string;
  subTask: string;
  pauseAfterFailure: boolean;
}

export interface QuartzLog {
  id: number;
  beanName: string;
  createTime: string;
  execTime: string;
  cronExpression: string;
  exceptionDetail: string;
  isSuccess: boolean;
  jobName: string;
  methodName: string;
  params: string;
  time: number;
}
