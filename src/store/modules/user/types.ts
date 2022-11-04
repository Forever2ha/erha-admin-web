export interface job {
  createTime?: number;
  enabled?: boolean;
  jobId?: number;
  jobSort?: number;
  name?: string;
  updateBy?: string;
  updateTime?: number;
}

export interface role {
  createTime?: number;
  dataScope?: number[];
  permission?: string[];
  description?: string;
  level?: number;
  name?: string;
  roleId?: number;
  updateBy?: string;
  updateTime?: number;
}

export interface user {
  avatarName: string;
  avatarPath: string;
  createTime: number;
  deptId: number;
  deptName: string;
  email: string;
  enabled: boolean;
  gender: string;
  nickName: string;
  phone: string;
  pwdResetTime: number;
  updateBy: string;
  updateTime: number;
  userId: number;
  username: string;
}

export interface UserState {
  jobs?: job[];
  permissions?: string[];
  roles?: role[];
  user?: user;
  nowRole?: string;
}
