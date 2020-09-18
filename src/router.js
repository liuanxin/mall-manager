import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout'
import { isNotBlank, isNotEmptyArray, isNotTrue, isTrue } from '@/utils/util'
import { getLocalData } from '@/utils/auth'

Vue.use(VueRouter)

/** 全局开始路由 */
const globalRouterBegin = [
  { path: '/login', component: () => import('@/views/login'), meta: { title: '登录' }, hidden: true }
]
/** 登陆用户都有的开始路由 */
const globalAllUserRouterBegin = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { title: '工作台', icon: 'dashboard' },
    children: [
      { path: '/index', component: () => import('@/views/index'), hidden: true }
    ]
  }
]
/** 登陆用户都有的结束路由 */
const globalAllUserRouterEnd = [
  {
    path: '/profile',
    component: Layout,
    meta: { title: '用户中心' },
    hidden: true,
    children: [
      { path: 'password', component: () => import('@/views/password'), meta: { title: '修改密码' }, hidden: true }
    ]
  }
]
/** 全局结束路由 */
const globalRouterEnd = [
  { path: '*', component: () => import('@/views/404'), meta: { title: '404' }, hidden: true }
]
const routersMapping = {
  'common': { path: '/common', component: Layout, meta: { icon: 'example' } },
  'user': { path: '/user', component: Layout, meta: { icon: 'user' } },
  'product': { path: '/product', component: Layout, meta: { icon: 'product' } },
  'order': { path: '/order', component: Layout, meta: { icon: 'order' } },
  'manager': { path: '/manager', component: Layout, meta: { icon: 'password' } },

  // !~! 如果没有 path 就用 key(见下面的 ~!~ 部分), 上面是一级菜单, 下面是相关的子菜单, hidden: true 的菜单将不显示

  'config': { component: () => import('@/views/common/config/config'), meta: { icon: 'table' } },
  'config-add': { component: () => import('@/views/common/config/config-add'), meta: { noCache: true }, hidden: true },
  'config-edit': { component: () => import('@/views/common/config/config-edit'), meta: { noCache: true }, hidden: true },

  'banner': { component: () => import('@/views/common/banner/banner'), meta: { icon: 'table' } },
  'banner-add': { component: () => import('@/views/common/banner/banner-add'), meta: { noCache: true }, hidden: true },
  'banner-edit': { component: () => import('@/views/common/banner/banner-edit'), meta: { noCache: true }, hidden: true },

  // path 如果是以 / 开头会被当作根路径，子不要以 / 开头

  'user-index': { path: 'index', component: () => import('@/views/user/user'), meta: { icon: 'table' } },
  'user-id': { path: 'id', component: () => import('@/views/user/user-id'), meta: { noCache: true }, hidden: true },
  'user-add': { path: 'add', component: () => import('@/views/user/user-add'), meta: { noCache: true }, hidden: true },
  'user-edit': { path: 'edit', component: () => import('@/views/user/user-edit'), meta: { noCache: true }, hidden: true },

  'product-index': { path: 'index', component: () => import('@/views/product/product'), meta: { icon: 'table' } },
  'product-id': { path: 'id', component: () => import('@/views/product/product-id'), meta: { icon: 'table' } },
  'product-add': { path: 'add', component: () => import('@/views/product/product-add'), meta: { noCache: true }, hidden: true },
  'product-edit': { path: 'edit', component: () => import('@/views/product/product-edit'), meta: { noCache: true }, hidden: true },

  'order-index': { path: 'index', component: () => import('@/views/order/order'), meta: { icon: 'table' } },
  'order-id': { path: 'id', component: () => import('@/views/order/order-id'), meta: { noCache: true }, hidden: true },

  'account': { component: () => import('@/views/manager/account/account'), meta: { icon: 'table' } },
  'account-add': { component: () => import('@/views/manager/account/account-add'), meta: { noCache: true }, hidden: true },
  'account-edit': { component: () => import('@/views/manager/account/account-edit'), meta: { noCache: true }, hidden: true},

  'role': { component: () => import('@/views/manager/role/role'), meta: { icon: 'table' } },
  'role-add': { component: () => import('@/views/manager/role/role-add'), meta: { noCache: true }, hidden: true },
  'role-edit': { component: () => import('@/views/manager/role/role-edit'), meta: { noCache: true }, hidden: true }
}

/**
 * <pre>
 * 所有的权限, 用户登录后、管理员操作角色时(https://element.eleme.cn/#/zh-CN/component/tree), 后端也返回下面的格式.
 *
 * 注意:
 *   1. 登录后的返回必须要有 front, 它的值跟上面 routers 的 key 要一一对应, 不需要返回 id
 *   2. 管理员操作角色时必须要有 id, 不需要返回 front, 如果是更新角色的操作, 还需要有角色的 id 用来做选中(default-checked-keys)
 *   <el-tree
 *     :data="data"
 *     node-key="id"
 *     show-checkbox
 *     :default-expanded-keys="checkedList"
 *     :default-checked-keys="checkedList"
 *     :props="defaultProps">
 *   </el-tree>
 *   其中 data 的值是 [
 *     { "id": 10, "name": "公共管理", "children": [ { "id": 101, "name": "全局配置" }, { "id": 102, "name": "banner 图" } ] },
 *     { "id": 20, "name": "系统管理", "children": [ { "id": 201, "name": "人员列表" }, { "id": 202, "name": "角色列表" } ] }
 *     ...
 *   ]
 *   checkedList 的值是 [ 102, 201 ]
 *   defaultProps 的值是 { children: 'children', label: 'name' }
 * </pre>
 */
const routersRelation = [
  {
    "name": "公共管理", "front": "common", "children": [
      { "name": "全局配置", "front": "config",
        // "children": [
        //   { "name": "配置 1", "front": "config-1" },
        //   { "name": "配置 2", "front": "config-2" },
        //   { "name": "配置 3", "front": "config-3" }
        // ]
      },
      { "name": "添加全局配置", "front": "config-add" },
      { "name": "编辑全局配置", "front": "config-edit" },

      { "name": "banner", "front": "banner" },
      { "name": "添加 banner", "front": "banner-add" },
      { "name": "编辑 banner", "front": "banner-edit" }
    ]
  },
  {
    "name": "用户管理", "front": "user", "children": [
      { "name": "用户列表", "front": "user-index" },
      { "name": "用户详情", "front": "user-id" },
      { "name": "添加用户", "front": "user-add" },
      { "name": "编辑用户", "front": "user-edit" }
    ]
  },
  {
    "name": "商品管理", "front": "product", "children": [
      { "name": "商品列表", "front": "product-index" },
      { "name": "商品详情", "front": "product-id" },
      { "name": "添加商品", "front": "product-add" },
      { "name": "编辑商品", "front": "product-edit" }
    ]
  },
  {
    "name": "订单管理", "front": "order", "children": [
      { "name": "订单列表", "front": "order-index" },
      { "name": "订单详情", "front": "order-id" }
    ]
  },
  {
    "name": "系统管理", "front": "manager", "children": [
      { "name": "人员列表", "front": "account" },
      { "name": "添加人员", "front": "account-add" },
      { "name": "编辑人员", "front": "account-edit" },

      { "name": "角色列表", "front": "role" },
      { "name": "添加角色", "front": "role-add" },
      { "name": "编辑角色", "front": "role-edit" }
    ]
  }
]

/** 管理员操作角色, 后端未提供数据时用到 */
const getMockMenus = () => {
  let arr = getDepthMock(0, routersRelation).child
  console.debug('/* ------------------------------ 深度优先 ------------------------------ */\n\n' + JSON.stringify(arr))

  arr = getBreadthMock(0, routersRelation).child
  console.debug('/* ------------------------------ 广度优先 ------------------------------ */\n\n' + JSON.stringify(arr))

  return arr
}
/** 深度优先(mock) */
const getDepthMock = (lastId, routers) => {
  const arr = []
  for (let i in routers) {
    const router = routers[i]
    lastId++

    const obj = {}
    obj.id = lastId
    obj.name = router.name

    const child = router.children
    if (isNotBlank(child)) {
      const depth = getDepthMock(lastId, child, arr)
      lastId = depth.id
      obj.children = depth.child
    }
    arr.push(obj)
  }
  return { id: lastId, child: arr }
}
/** 广度优先(mock) */
const getBreadthMock = (lastId, routers) => {
  const arr = []
  for (let i in routers) {
    const router = routers[i]
    lastId++

    const obj = {}
    obj.id = lastId
    obj.name = router.name
    arr.push(obj)
  }
  for (let i in routers) {
    const child = routers[i].children
    if (isNotBlank(child)) {
      const depth = getBreadthMock(lastId, child, arr)
      lastId = depth.id
      arr[i].children = depth.child
    }
  }
  return { id: lastId, child: arr }
}

/** 用户的路由地址 */
const getUserPaths = (data) => {
  const paths = []

  const allRouters = []
  allRouters.push(...globalRouterBegin)
  allRouters.push(...globalAllUserRouterBegin)
  if (isNotBlank(data)) {
    const routers = fillRouter(isTrue(data.hasAdmin) ? routersRelation : data.menus)
    if (routers.length > 0) {
      allRouters.push(...routers)
    }
  }
  allRouters.push(...globalAllUserRouterEnd)

  for (let i in allRouters) {
    const path = allRouters[i].path
    if (isNotBlank(path)) {
      paths.push(path)
    }
    getPath(paths, allRouters[i])
  }
  return paths
}
const getPath = (arr, router) => {
  const children = router.children
  if (isNotEmptyArray(children)) {
    const path = router.path
    for (let i in children) {
      const child = children[i]
      const childPath = child.path
      arr.push(childPath.startsWith('/') ? childPath : (path + '/' + childPath))
      getPath(arr, child)
    }
  }
}

const getMenuSql = () => {
  const arr = []
  arr.push("DROP TABLE IF EXISTS `t_manager_menu`;\n")
  arr.push("CREATE TABLE IF NOT EXISTS `t_manager_menu` (\n")
  arr.push("  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,\n")
  arr.push("  `pid` BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父菜单, 0 则表示是根菜单',\n")
  arr.push("  `name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '菜单说明',\n")
  arr.push("  `front` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '前端对应的值(如 path 或 name)',\n")
  arr.push("  PRIMARY KEY (`id`),\n")
  arr.push("  UNIQUE KEY `name` (`name`)\n")
  arr.push(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单, 需要跟前端对应, 前端每增加一个菜单就需要添加一条记录, 与角色是 多对多 的关系';\n\n")
  console.debug('/* ------------------------------ 建表语句 ------------------------------ */\n\n' + arr.join(''))

  arr.splice(0, arr.length)
  getDepthSql(0, 0, routersRelation, arr)
  console.debug('/* ------------------------------ 深度优先 ------------------------------ */\n\n' + arr.join(''))

  arr.splice(0, arr.length)
  getBreadthSql(0, 0, routersRelation, arr)
  console.debug('/* ------------------------------ 广度优先 ------------------------------ */\n\n' + arr.join(''))
}
/** 深度优先 */
const getDepthSql = (lastId, pid, routers, arr) => {
  for (let i in routers) {
    const router = routers[i]
    const id = lastId + 1
    lastId++
    arr.push('REPLACE INTO `t_manager_menu`(`id`, `pid`, `name`, `front`) VALUES (')
    arr.push(id + ', ' + pid + ', \'' + router.name + '\', \'' + router.front + '\');\n')

    const child = router.children
    if (isNotBlank(child)) {
      lastId = getDepthSql(lastId, id, child, arr)
      if (pid === 0) {
        arr.push('\n')
      }
    }
  }
  return lastId
}
/** 广度优先 */
const getBreadthSql = (lastId, pid, routers, arr) => {
  const tmp = {}
  for (let i in routers) {
    const router = routers[i]
    const id = lastId + 1
    lastId++
    arr.push('REPLACE INTO `t_manager_menu`(`id`, `pid`, `name`, `front`) VALUES (')
    arr.push(id + ', ' + pid + ', \'' + router.name + '\', \'' + router.front + '\');\n')
    tmp[i] = id
  }
  arr.push('\n')
  for (let i in routers) {
    const router = routers[i]

    const child = router.children
    if (isNotBlank(child)) {
      lastId = getBreadthSql(lastId, tmp[i], child, arr)
    }
  }
  return lastId
}

/**
 * <pre>
 * 超级管理员返回: { id: 1, name: '张三', hasAdmin: true } 如果 hasAdmin 为 true 则不需要返回 menus 数据(id name 视情况而定)
 * 普通用户返回: { id: 10, name: '李四', hasAdmin: false, menus: XXX } 不是管理员则需要返回菜单数据, XXX 的格式跟上面的 admin 一致
 *
 * 如果不传 data 或者 data 为 undefined 或 null 则返回未登录用户的权限
 * </pre>
 */
const getRouter = (data) => {
  const returnRouter = []
  returnRouter.push(...globalRouterBegin)
  if (isNotBlank(data)) {
    returnRouter.push(...globalAllUserRouterBegin)
    // 如果是管理员就无视 menus 属性
    const routers = fillRouter(isTrue(data.hasAdmin) ? routersRelation : data.menus)
    if (routers.length > 0) {
      returnRouter.push(...routers)
    }
    returnRouter.push(...globalAllUserRouterEnd)
  }
  returnRouter.push(...globalRouterEnd)
  return returnRouter
}
const fillRouter = (menus) => {
  const returnRoutes = []
  if (isNotBlank(menus) && Array.isArray(menus)) {
    menus.forEach((element) => {
      if (isNotBlank(element)) {
        const key = element.front
        const router = { ...routersMapping[key] }
        if (isNotBlank(router)) {
          // ~!~ 规则里如果没有配置 path 就用 key 来填充(见上面的 !~! 部分)
          if (!router.hasOwnProperty('path')) {
            router.path = key
          }
          // front 做 router 的 name
          router.name = key
          // name 做 router 的 title
          const title = element.name
          if (isNotBlank(title)) {
            if (router.hasOwnProperty('meta')) {
              router.meta.title = title
            } else {
              router.meta = { title: title }
            }
          }
          // 填充子路由
          const children = element.children
          if (isNotBlank(children)) {
            router.children = fillRouter(children)
          }
          returnRoutes.push(router)
        }
      }
    })
  }
  return returnRoutes
}

const createRouter = (data) => {
  if (isNotTrue(process.env.VUE_APP_ONLINE)) {
    getMenuSql()
    getMockMenus()
  }
  return new VueRouter({
    // 如果只有 ip 没有域名, 想用 二级目录 来路由, 不建议使用 history, 见 vue.config.js 中的 publicPath 配置
    // mode: 'history', // https://router.vuejs.org/zh/guide/essentials/history-mode.html
    routes: getRouter(data)
  })
}
const router = createRouter(getLocalData())

const resetRouter = (data) => {
  // https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
  router.matcher = createRouter(data).matcher

  // const newRouter = getRouter(data)
  // router.addRoutes(newRouter)
  // router.options.routes = newRouter
}

export default router
export { getMockMenus, getUserPaths, getRouter, resetRouter }
