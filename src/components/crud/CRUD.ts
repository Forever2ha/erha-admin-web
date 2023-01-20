/* eslint-disable */
import { reactive, watch, ref, getCurrentInstance, nextTick } from 'vue';
import axios from 'axios';
import { TableColumnData } from '@arco-design/web-vue';
import { DeepPartial } from '@/components/crud/typings';

import { useI18n } from 'vue-i18n';
import { HttpResponse } from '@/api/interceptor';
import { assignDeep, copy, parseTime } from '@/utils';

/**
 * crud默认配置: 字段详细信息看CrudOptions<T>接口
 */
const defaultOptions = {
  tag: 'default',
  title: '',
  url: '',
  tableInfo: {
    list: [],
    columns: [],
    data: [],
    selectKeys: [],
    componentConfig: {
      border: false, // 是否开启边框
      colResizable: false, // 是否可调整列宽度
      tableHeader: true, // 是否显示表头
      checkbox: true, // 是否显示复选框
      stripe: true, // 是否显示数据条纹
    },
    isEdit: false,
  },
  query: {},
  form: {},
  page: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    componentConfig: {
      disable: false,
      pageSizeOptions: [10, 20, 30, 40, 50, 60],
      size: 'medium',
      baseSize: 6,
      bufferSize: 2,
    },
  },
  props: {
    formUpdateSuccessIds: [],
  },
  debug: true,
};

// 数据响应结果接口
interface CrudResp<T> {
  currentPage: number; // 当前页
  pageSize: number; // 每页大小
  totalCount: number; // 总数据个数
  totalPage: number; // 总页数
  list: T[];
}

// crud组件状态
const CrudStatus = {
  NORMAL: 1,
  NEED_REFRESH: 2,
  REFRESHING: 3,
  NEED_UPDATE: 4,
  UPDATING: 5,
  NEED_DELETE: 6,
  DELETING: 7,
  NEED_DOWNLOAD: 8,
  DOWNLOADING: 9,
};

// 分页信息接口
interface Page {
  currentPage: number; // 当前页
  pageSize: number; // 每页大小
  totalCount?: number; // 总数据个数
  sidx?: string; // 排序键
  order?: string; // asc正序 desc倒序
  componentConfig?: {
    disable: boolean; // 是否禁用分页
    pageSizeOptions: number[]; // 数据条数选择器的选项列表[10, 20, 30, 40, 50]
    size: 'mini' | 'small' | 'medium' | 'large'; // 分页选择器的大小
    baseSize: number; // 计算显示省略的基础个数。显示省略的个数为 baseSize + 2 * bufferSize
    bufferSize: number; // 显示省略号时，当前页码左右显示的页码个数
  };
  [key: string]: any;
}

// tableColumnData拓展接口，增加display:决定是否展示此列
export interface TableColumDataPlus extends TableColumnData {
  display: boolean; // 是否展示
  ignoreSwitch?: boolean; // 是否展示开启此列开关
}

// crud配置接口
interface CrudOptions<T> {
  tag: string; // 配置标签
  title: string; // 标题
  url: string; // 请求url地址
  tableInfo: {
    list: T[] | undefined; // 原数据信息
    columns: TableColumDataPlus[] | undefined; // table列
    data: T[] | undefined; // table数据
    selectKeys: number[]; // 选中的列id
    componentConfig: {
      border: boolean; // 是否开启边框
      colResizable: boolean; // 是否可调整列宽度
      tableHeader: boolean; // 是否显示表头
      checkbox: boolean; // 是否显示复选框
      stripe: boolean; // 是否显示数据条纹
    }; // 表格的基本设置
    isEdit?: boolean; // 是否在修改表的数据
  }; // 表格数据
  query: any; // 查询的参数
  form: any; // 新增/修改/删除的表单
  props: any; // 拓展的配置
  page: Page; // 分页
  debug: boolean; // 是否开启debug
}
// crud方法接口
interface CrudMethod {
  refresh: () => void;
  add: () => void;
  update: () => void;
  delete: () => void;
  download: () => void;
}

// crud配置更新接口
interface CrudUpdate {
  appendPage: (page: { [key: string]: number }) => void;
  appendTableConfig: (obj: { [key: string]: any }) => void;
  setStatus: (status: number) => void;
  setTableColumns: (col: TableColumDataPlus[]) => void;
  appendQueryParams: (params: any) => void;
  resetParams: () => void;
  setForm: (obj: any) => void;
  setTableSelectKeys: (obj: any) => void;
  setTableIsEdit: (flag: boolean) => void;
  displayColRes: (flag: boolean) => void;
  turnToEditable: (data: any[]) => void;
  turnToUnEditable: (data: any[]) => void;
  setQuery: (data: any) => void;
}

interface CrudHook {
  // crud method中四个基本钩子,beforexxx 返回true表示继续进行下去 返回false则终止行动
  /** 刷新 - 之前 */
  beforeRefresh: () => boolean;
  /** 刷新 - 之后 */
  afterRefresh: () => void;
  /** 删除 - 之前 */
  beforeDelete: () => boolean;
  /** 删除 - 之后 */
  afterDelete: () => void;
  /** 新增 - 之前 */
  beforeAdd: () => boolean;
  /** 新增 - 之后 */
  afterAdd: () => void;
  /** 修改 - 之前 */
  beforeEdit: () => boolean;
  /** 修改 - 之后 */
  afterEdit: () => void;

  // crud update中的钩子,beforexxx 返回true表示继续进行下去 返回false则终止行动
  /** 重置options.query - 之前 */
  beforeResetParams: () => boolean;
  /** 重置options.query - 之后 */
  afterResetParams: () => void;

  // 其他钩子,beforexxx 返回true表示继续进行下去 返回false则终止行动
  /* 打开新增窗口之前 */
  beforeOpenAdd: () => boolean;
  /* 打开新增窗口之后 */
  afterOpenAdd: () => void;
  /* 打开修改窗口之前 */
  beforeOpenEdit: () => Promise<boolean>;
  /* 打开修改窗口之后 */
  afterOpenEdit: () => void;
}
// 包含以上四个接口,通过useCrud()直接得到这个类型的实例
interface CRUD<T> {
  options: CrudOptions<T>;
  status: number;
  method: CrudMethod;
  update: CrudUpdate;
  hook: CrudHook;
}

// 下载文件
function downloadFile(obj: any, name: any, suffix: any) {
  const url = window.URL.createObjectURL(new Blob([obj]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  const fileName = `${parseTime(new Date())}-${name}.${suffix}`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 封装成响应式,暴露给外界使用

const useCrud = <T>(opt: DeepPartial<CrudOptions<T>>) => {
  const finalOpt = assignDeep(copy(defaultOptions), opt);
  const { t } = useI18n(); // 国际化
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  const options = reactive(finalOpt) as CrudOptions<T>;
  const status = ref(CrudStatus.NORMAL);

  let hook: CrudHook;
  let update: CrudUpdate;
  let method: CrudMethod;
  // eslint-disable-next-line prefer-const
  hook = {
    // crud method中四个基本钩子,beforexxx 返回true表示继续进行下去 返回false则终止行动
    /** 刷新 - 之前 */
    beforeRefresh: () => true,
    /** 刷新 - 之后 */
    afterRefresh: () => {},
    /** 删除 - 之前 */
    beforeDelete: () => true,
    /** 删除 - 之后 */
    afterDelete: () => {},
    /** 新增 - 之前 */
    beforeAdd: () => true,
    /** 新增 - 之后 */
    afterAdd: () => {},
    /** 修改 - 之前 */
    beforeEdit: () => true,
    /** 修改 - 之后 */
    afterEdit: () => {},

    // crud update中的钩子,beforexxx 返回true表示继续进行下去 返回false则终止行动
    /** 重置options.query - 之前 */
    beforeResetParams: () => true,
    /** 重置options.query - 之后 */
    afterResetParams: () => {},

    // 其他钩子,beforexxx 返回true表示继续进行下去 返回false则终止行动
    /* 打开新增窗口之前 */
    beforeOpenAdd: () => true,
    /* 打开新增窗口之后 */
    afterOpenAdd: () => {},
    /* 打开修改窗口之前 */
    beforeOpenEdit: async () => true,
    /* 打开修改窗口之后 */
    afterOpenEdit: () => {},
  }; // CRUD钩子
  // eslint-disable-next-line prefer-const
  update = {
    // 以append开头设置表示将 传入的参数混入,有的属性进行替换，没有的进行追加。
    // 以set开头设置表示直接将 传入参数直接替换当前对象

    // 设置查询条件
    setQuery: (data: any) => {
      options.query = data;
    },
    // 根据tableInfo.selectKeys来更改数据的editable属性
    turnToEditable: (data: any[]) => {
      data.forEach((obj: any) => {
        if (options.tableInfo.selectKeys.includes(obj.id)) {
          obj.editable = true;
          (options.form as any)[obj.id] = { id: obj.id };
        }
        if (obj.children) {
          update.turnToEditable(obj.children);
        }
      });
    },
    turnToUnEditable: (data: any[]) => {
      data.forEach((obj: any) => {
        if (options.tableInfo.selectKeys.includes(obj.id)) {
          delete obj.errMsg;
          obj.editable = false;
        }
        if (obj.children) {
          update.turnToUnEditable(obj.children);
        }
      });
    },

    // 不显示更新结果列
    displayColRes: (flag: boolean) => {
      (options.tableInfo.columns as any)[0].display = flag;
    },
    // 设置表格配置信息
    appendTableConfig: (obj) => {
      options.tableInfo.componentConfig = {
        ...options.tableInfo.componentConfig,
        ...obj,
      };
    },
    // 设置表格数据编辑状态
    setTableIsEdit: (flag) => {
      options.tableInfo.isEdit = flag;
    },
    // 重置params
    resetParams: () => {
      if (!hook.beforeResetParams()) {
        return;
      }
      options.query = {};
      hook.afterResetParams();
      method.refresh();
    },
    // 设置分页信息
    appendPage: (page: { [key: string]: number }) => {
      Object.keys(page).forEach((key) => {
        (options.page as Page)[key] = page[key];
      });
    },
    // 设置状态
    setStatus: (s: number) => {
      status.value = s;
    },
    // 设置table columns信息
    setTableColumns: (col: TableColumDataPlus[]) => {
      options.tableInfo.columns = col as any;
    },
    // 设置查询参数
    appendQueryParams: (params: any) => {
      Object.assign(options.query, params);
    },
    // 设置表单信息
    setForm: (obj: any) => {
      options.form = obj;
    },
    // 设置表格选择列
    setTableSelectKeys: (obj: any) => {
      options.tableInfo.selectKeys = obj;
    },
  }; // 改变crud的基本信息
  method = {
    refresh: async () => {
      if (options.debug) {
        console.log(`[CRUD:debug:${options.tag}] : refresh`);
      }
      if (!hook.beforeRefresh()) {
        status.value = CrudStatus.NORMAL;
        return;
      }
      status.value = CrudStatus.REFRESHING;
      const { data } = await axios.get<CrudResp<T>>(`${options.url}`, {
        params: {
          pageSize: options.page.pageSize,
          currentPage: options.page.currentPage,
          ...options.query,
        },
      });

      // 设置分页信息
      update.appendPage({
        currentPage: data.currentPage,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
      });

      // 设置表格data,原数据data
      options.tableInfo.list = JSON.parse(JSON.stringify(data.list));
      options.tableInfo.data = JSON.parse(JSON.stringify(data.list));

      // 刷新完毕更改状态
      update.setStatus(CrudStatus.NORMAL);
      hook.afterRefresh();
    },
    add: async () => {
      if (options.debug) {
        console.log(`[CRUD:debug:${options.tag}] : add`);
      }
      if (!hook.beforeAdd()) {
        status.value = CrudStatus.NORMAL;
        return;
      }
      options.props.addForm = {};

      const data = (await axios.post(
        options.url,
        options.form
      )) as HttpResponse;

      if (data.code === 40006) {
        options.props.addForm.success = false;
        options.props.addForm.reason = data.msg;
      } else {
        options.props.addForm.success = true;
      }
      method.refresh();
      hook.afterAdd();
    },
    delete: async () => {
      if (options.debug) {
        console.log(`[CRUD:debug:${options.tag}] : delete`);
      }
      if (!hook.beforeDelete()) {
        status.value = CrudStatus.NORMAL;
        return;
      }
      status.value = CrudStatus.DELETING;
      options.form = options.tableInfo.selectKeys;
      try {
        const data = (await axios.delete(options.url, {
          data: options.tableInfo.selectKeys,
        })) as any;
        if (data.code === 20000) {
          global.$notification.success('删除成功');
        } else {
          global.$notification.warning(`删除失败:${data.msg}`);
        }
      } catch (e) {
        // ignore
      }

      status.value = CrudStatus.NORMAL;
      options.form = {};
      options.tableInfo.selectKeys = [];
      method.refresh();
      hook.afterDelete();
    },
    update: async () => {
      if (!hook.beforeEdit()) {
        status.value = CrudStatus.NORMAL;
        return;
      }
      console.log('update');
      status.value = CrudStatus.UPDATING;

      const dealtForm: any[] = [];
      Object.keys(options.form).forEach((index) => {
        // 过滤没改的数据,以及刚才成功提交的数据
        if (
          Object.keys(options.form[index]).length > 1 &&
          !(options.props.formUpdateSuccessIds as any[]).includes(
            parseInt(index, 10)
          )
        ) {
          dealtForm.push(options.form[index]);
        }
      });

      // todo 去除没有更改的属性
      try {
        if (dealtForm.length !== 0) {
          // 发送请求
          const data = (await axios.put(options.url, dealtForm)) as any;

          if (data.code === 20000) {
            options.tableInfo.isEdit = false;
            update.turnToUnEditable(options.tableInfo.data as any[]);
            update.setTableSelectKeys([]);
            update.appendTableConfig({ checkbox: true });
            global.$notification.success('更改成功');
            (options.tableInfo.columns as any)[0].display = false;
            method.refresh();
            options.form = {};
          } else {
            global.$notification.warning('更改失败：部分/全部');

            const errMsg: { [key: string]: any[] } = {};
            data.data.forEach((res: any) => {
              if (!errMsg[res.id]) {
                errMsg[res.id] = [];
              }
              errMsg[res.id].push({ ...res });
            });

            // 对批量修改的数据进行标记：有错/无错/无修改
            const dealtFormKeys = dealtForm.map((key: any) => key.id);
            // eslint-disable-next-line no-inner-declarations
            function dealtRes(data_: any[]) {
              data_.forEach((obj: any) => {
                if (options.tableInfo.selectKeys.includes(obj.id)) {
                  if (errMsg[obj.id]) {
                    // 有错
                    obj.updateErr = errMsg[obj.id];
                  } else if (dealtFormKeys.includes(obj.id)) {
                    // 无错
                    obj.updateErr = false;
                    obj.editable = false;
                    options.props.formUpdateSuccessIds.push(obj.id);
                  }
                }
                if (obj.children) {
                  dealtRes(obj.children);
                }
              });
            }
            dealtRes(options.tableInfo.data as any[]);
          }
        } else {
          global.$notification.warning('您没有更改任何数据');
        }
      } catch (e) {
        // ignore
      }

      status.value = CrudStatus.NORMAL;
      hook.afterEdit();
    },
    download: async () => {
      status.value = CrudStatus.DOWNLOADING;
      const data = await axios.get(`${options.url}/download`, {
        responseType: 'blob',
      });
      downloadFile(data, options.tag, 'xlsx');
      status.value = CrudStatus.NORMAL;
    },
  }; // crud的四种方法

  // 监控status的变化,以确定是否更新数据
  watch(status, (newVal, oldValue) => {
    if (options.debug) {
      console.log(
        `[CRUD:debug:${options.tag}] : crud.status 状态${oldValue}-->${newVal}`
      );
      console.log('\n');
    }
    if (status.value === CrudStatus.NEED_REFRESH) {
      method.refresh();
    } else if (status.value === CrudStatus.NEED_UPDATE) {
      method.update();
    } else if (status.value === CrudStatus.NEED_DELETE) {
      method.delete();
    } else if (status.value === CrudStatus.NEED_DOWNLOAD) {
      method.download();
    }
  });

  console.log(`[CRUD:debug:${options.tag}] : 初始化完毕`);
  return { method, update, hook, options, status };
};

// useCrud()返回CRUDOperation这个类型的实例
export { useCrud, CrudStatus, CRUD };
