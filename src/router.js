import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout'
import { isNotBlank } from '@/utils'
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
const routers = {
  'common': { path: '/common', component: Layout, meta: { icon: 'example' } },
  'user': { path: '/user', component: Layout, meta: { icon: 'user' } },
  'product': { path: '/product', component: Layout, meta: { icon: 'product' } },
  'order': { path: '/order', component: Layout, meta: { icon: 'order' } },
  'manager': { path: '/manager', component: Layout, meta: { icon: 'password' } },

  // !~! 如果没有 path 就用 key(见下面的 ~!~ 部分), 上面是一级菜单, 下面是相关的子菜单, hidden: true 的菜单将不显示

  'config': { component: () => import('@/views/common/config/index'), meta: { icon: 'table' } },
  'config-add': { component: () => import('@/views/common/config/add'), meta: { noCache: true }, hidden: true },
  'config-edit': { component: () => import('@/views/common/config/edit'), meta: { noCache: true }, hidden: true },

  'banner': { component: () => import('@/views/common/banner/index'), meta: { icon: 'table' } },
  'banner-add': { component: () => import('@/views/common/banner/add'), meta: { noCache: true }, hidden: true },
  'banner-edit': { component: () => import('@/views/common/banner/edit'), meta: { noCache: true }, hidden: true },

  // path 如果不是以 / 开头会把 parent 也拼进去, 所以下面的 path 都是 index、add 和 edit

  'user-index': { path: 'index', component: () => import('@/views/user/index'), meta: { icon: 'table' } },
  'user-id': { path: 'id', component: () => import('@/views/user/id'), meta: { noCache: true }, hidden: true },
  'user-add': { path: 'add', component: () => import('@/views/user/add'), meta: { noCache: true }, hidden: true },
  'user-edit': { path: 'edit', component: () => import('@/views/user/edit'), meta: { noCache: true }, hidden: true },

  'product-index': { path: 'index', component: () => import('@/views/product/index'), meta: { icon: 'table' } },
  'product-id': { path: 'id', component: () => import('@/views/product/id'), meta: { icon: 'table' } },
  'product-add': { path: 'add', component: () => import('@/views/product/add'), meta: { noCache: true }, hidden: true },
  'product-edit': { path: 'edit', component: () => import('@/views/product/edit'), meta: { noCache: true }, hidden: true },

  'order-index': { path: 'index', component: () => import('@/views/order/index'), meta: { icon: 'table' } },
  'order-id': { path: 'id', component: () => import('@/views/order/id'), meta: { noCache: true }, hidden: true },

  'account': { component: () => import('@/views/manager/account/index'), meta: { icon: 'table' } },
  'account-add': { component: () => import('@/views/manager/account/add'), meta: { noCache: true }, hidden: true },
  'account-edit': { component: () => import('@/views/manager/account/edit'), meta: { noCache: true }, hidden: true},

  'role': { component: () => import('@/views/manager/role/index'), meta: { icon: 'table' } },
  'role-add': { component: () => import('@/views/manager/role/add'), meta: { noCache: true }, hidden: true },
  'role-edit': { component: () => import('@/views/manager/role/edit'), meta: { noCache: true }, hidden: true }
}

/** 管理员权限格式, 用户登录后后端也返回下面的格式. 注意: front 的值跟上面 routers 的 key 要一一对应 */
const adminRouters = [
  {
    "name": "公共管理", "front": "common", "children": [
      { "name": "全局配置", "front": "config-index" },
      { "name": "添加全局配置", "front": "config-add" },
      { "name": "编辑全局配置", "front": "config-edit" },

      { "name": "banner", "front": "banner-index" },
      { "name": "添加 banner", "front": "banner-add" },
      { "name": "编辑 banner", "front": "banner-edit" }
    ]
  },
  {
    "name": "用户管理", "front": "user", "children": [
      { "name": "用户列表", "front": "user-index" },
      { "name": "用户详情", "front": "user-index" },
      { "name": "添加用户", "front": "user-add" },
      { "name": "编辑用户", "front": "user-edit" }
    ]
  },
  {
    "name": "商品管理", "front": "product", "children": [
      { "name": "商品列表", "front": "product-index" },
      { "name": "商品详情", "front": "product-index" },
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
      { "name": "人员列表", "front": "account-index" },
      { "name": "添加人员", "front": "account-add" },
      { "name": "编辑人员", "front": "account-edit" },

      { "name": "角色列表", "front": "role-index" },
      { "name": "添加角色", "front": "role-add" },
      { "name": "编辑角色", "front": "role-edit" }
    ]
  }
]

/**
 * 超级管理员返回: { id: 1, name: '张三', hasAdmin: true } 如果 hasAdmin 为 true 则不需要返回 menus 数据(id name 视情况而定)
 * 普通用户返回: { id: 10, name: '李四', hasAdmin: false, menus: XXX } 不是管理员则需要返回菜单数据, XXX 的格式跟上面的 admin 一致
 *
 * 如果不传 data 或者 data 为 undefined 或 null 则返回未登录用户的权限
 */
const getRouter = (data) => {
  const returnRouter = []
  returnRouter.push(...globalRouterBegin)
  if (isNotBlank(data)) {
    returnRouter.push(...globalAllUserRouterBegin)
    // 如果是管理员就无视 menus 属性
    const routers = fillRouter(data['hasAdmin'] === true ? adminRouters : data['menus'])
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
        const key = element['front']
        const router = { ...routers[key] }
        if (isNotBlank(router)) {
          // ~!~ 规则里如果没有配置 path 就用 key 来填充(见上面的 !~! 部分)
          if (!router.hasOwnProperty('path')) {
            router.path = key
          }
          // front 做 router 的 name
          router.name = key
          // name 做 router 的 title
          const title = element['name']
          if (isNotBlank(title)) {
            if (router.hasOwnProperty('meta')) {
              router.meta.title = title
            } else {
              router.meta = { title: title }
            }
          }
          // 填充子路由
          const children = element['children']
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

const checkRouter = (routers, path) => {
  for (let i in routers) {
    const r = routers[i]
    if (r.path === path) {
      return true
    } else {
      if (isNotBlank(r.children)) {
        const flag = checkChildRouter(r.children, r.path, path)
        if (flag === true) {
          return true
        }
      }
    }
  }
  return false
}
const checkChildRouter = (routers, parentPath, path) => {
  for (let i in routers) {
    const r = routers[i]
    const newParentPath = (r.path.startsWith('/') ? r.path : (parentPath + '/' + r.path))
    if (newParentPath === path) {
      return true
    } else {
      if (isNotBlank(r.children)) {
        const flag = checkChildRouter(r.children, newParentPath, path)
        if (flag === true) {
          return true
        }
      }
    }
  }
  return false
}

const createRouter = (data) => {
  return new VueRouter({
    mode: 'history', // https://router.vuejs.org/zh/guide/essentials/history-mode.html
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
export { getRouter, checkRouter, resetRouter }
