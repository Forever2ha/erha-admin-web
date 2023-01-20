import localeUser from '@/views/system/user/setting/locale/zh-CN';

export default {
  ...localeUser,
  'menu.system.user': '用户管理',
  'menu.system.role': '角色管理',
  'menu.system.dept': '部门管理',
  'menu.system.job': '岗位管理',
  'menu.system.dict': '字典管理',
  'menu.system.menu': '菜单管理',
  'menu.system.quartz': '任务调度',
  // quartzLog
  'system.quartzLog.table.id': 'ID',
  'system.quartzLog.table.jobName': '任务名称',
  'system.quartzLog.table.beanName': 'Bean名称',
  'system.quartzLog.table.methodName': '方法名称',
  'system.quartzLog.table.params': '方法参数',
  'system.quartzLog.table.cronExpression': 'Cron表达式',
  'system.quartzLog.table.isSuccess': '状态',
  'system.quartzLog.table.exceptionDetail': '异常信息',
  'system.quartzLog.table.time': '耗时(ms)',
  'system.quartzLog.table.execTime': '执行时间',
  // quartz
  'system.quartz': '任务调度',
  'system.quartz.table.id': 'ID',
  'system.quartz.table.beanName': 'Bean名称',
  'system.quartz.table.cronExpression': 'Cron表达式',
  'system.quartz.table.isPause': '状态',
  'system.quartz.table.jobName': '任务名称',
  'system.quartz.table.methodName': '方法名称',
  'system.quartz.table.params': '方法参数',
  'system.quartz.table.description': '任务描述',
  'system.quartz.table.personInCharge': '负责人',
  'system.quartz.table.email': '告警邮箱',
  'system.quartz.table.subTask': '子任务',
  'system.quartz.table.pauseAfterFailure': '失败后暂停',
  // menu
  'system.menu': '菜单',
  'system.menu.table.title': '标题',
  'system.menu.table.type': '类型',
  'system.menu.table.name': '路由名称',
  'system.menu.table.path': '路由',
  'system.menu.table.iFrame': '外链',
  'system.menu.table.subCount': '子菜单数目',
  'system.menu.table.locale': '语言包键值',
  'system.menu.table.icon': '图标',
  'system.menu.table.order': '排序',
  'system.menu.table.hidden': '隐藏',
  'system.menu.table.cache': '缓存',
  'system.menu.table.permission': '权限',
  'system.menu.table.pid': '上级菜单',
  // dictDetail
  'system.dictDetail': '字典详情',
  'system.dictDetail.table.label': '标签',
  'system.dictDetail.table.dictDetailSort': '排序',
  'system.dictDetail.table.value': '值',

  // dict
  'system.dict': '字典',
  'system.dict.table.name': '名称',
  'system.dict.table.description': '描述',
  // job
  'system.job': '岗位',
  'system.job.table.name': '名称',
  'system.job.table.sort': '排序',
  'system.job.table.enabled': '状态',
  // dept
  'system.dept': '部门',
  'system.dept.table.name': '名称',
  'system.dept.table.sort': '排序',
  'system.dept.table.enabled': '状态',
  'system.dept.table.pid': '上级部门',
  'system.dept.table.isTop': '顶级部门',
  'system.dept.table.subCount': '子部门数量',
  // user
  'system.user': '用户',
  'system.user.table.id': 'ID',
  'system.user.table.avatarName': '头像文件名',
  'system.user.table.avatarPath': '头像路径',
  'system.user.table.createTime': '创建时间',
  'system.user.table.createBy': '被谁创建',
  'system.user.table.deptId': '部门编号',
  'system.user.table.deptName': '部门',
  'system.user.table.email': '邮箱',
  'system.user.table.enabled': '状态',
  'system.user.table.gender': '性别',
  'system.user.table.jobs': '职位',
  'system.user.table.nickName': '昵称',
  'system.user.table.nowRoleId': '当前选择角色编号',
  'system.user.table.phone': '电话',
  'system.user.table.pwdResetTime': '密码重置时间',
  'system.user.table.roles': '角色',
  'system.user.table.updateBy': '被谁更新了',
  'system.user.table.updateTime': '被更新的时间',
  'system.user.table.userId': '用户编号',
  'system.user.table.username': '用户名',
  'system.user.searchDept': '输入部门名称进行搜索',
  'system.user.searchNameOrEmail': '输入名称或邮箱搜素',
  'system.user.status': '状态',
  'system.user.status.activate': '激活',
  'system.user.status.lock': '锁定',
  // role
  'system.role': '角色',
  'system.role.table.id': 'ID',
  'system.role.table.name': '名称',
  'system.role.table.dataScope': '数据范围',
  'system.role.table.dataPerm': '数据权限',
  'system.role.table.level': '等级',
  'system.role.table.description': '描述',
  'system.role.table.deptIds': '数据权限',
};
