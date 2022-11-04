export interface BaseResp<T> {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  list: T[];
}

export interface BaseField {
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
}
