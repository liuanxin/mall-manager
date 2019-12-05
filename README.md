
```sh
# 使用国内镜像并安装项目所需包
npm config set registry https://registry.npm.taobao.org
npm install
```

本地运行: `npm run dev`  
构建测试环境: `npm run test`  
构建生产环境 `npm run build`

```text
├── dist               打包以后的文件存放目录
├── node_modules       项目依赖包
├── package-lock.json  运行 npm install 时会将依赖写进这里, node 的版本号(^~ 这种)是一个灾难, 是否将其加入 vc 是一个问题
│
│    !!!上面的不需要版本控制!!!
│
├── public             见: https://cli.vuejs.org/zh/guide/html-and-static-assets.html#public-%E6%96%87%E4%BB%B6%E5%A4%B9
├── src                源码目录
│   ├── api              请求后台接口的目录
│   ├── assets           项目用到的静态图片目录
│   ├── components       组件目录
│   ├── icons            图标目录
│   ├── layout           页面布局目录
│   ├── store            vuex
│   ├── styles           样式文件目录
│   ├── utils            工具目录
│   ├── views            页面目录
│   │
│   │    !!!!上面的是目录, 下面是文件!!!
│   │
│   ├── App.vue          也不是很懂 public/index.html 和 main.js 和 App.vue 三者为什么要搞这么复杂
│   ├── main.js          程序入口, 初始化 vue 实例、样式、插件、公共组件
│   ├── permission.js    权限管理, 建一个同名目录, 里面放一个 index.js 是一样的
│   ├── router.js        路由管理, 建一个同名目录, 里面放一个 index.js 是一样的
│   └── settings.js      全局静态设置
│
├── .editorconfig      编辑器配置, 给 ide 用的
├── .env.development   本地开发的配置文件
├── .env.production    生产环境的配置文件
├── .env.staging       测试环境的配置文件
├── babel.config.js    打包时将一些语法(比如 import(...) 这种)转换成标准的 babel 工具用到的配置
├── jsconfig.json      js 配置, 给 ide 用的
├── package.json       项目配置
└── vue.config.js      运行 npm run .. 命令时 vue-cli-service 使用的配置(比如要修改端口时)
```
