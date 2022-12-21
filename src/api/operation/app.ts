export interface OraApp {
  name: string;
  uploadPath: string;
  deployPath: string;
  backupPath: string;
  port: number;
  startScript: string;
  deployScript: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
  projectId: number;
}