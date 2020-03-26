
使用国内镜像并安装项目所需包
```sh
yarn config set registry https://registry.npm.taobao.org
yarn
```

本地运行: `yarn dev`  
打包测试环境: `yarn test`  
打包生产环境: `yarn build`

```text
├── dist             打包以后的文件存放目录
├── node_modules     项目依赖包
│
│    !!!上面的不需要版本控制!!!
│
├── public            见: https://cli.vuejs.org/zh/guide/html-and-static-assets.html#public-%E6%96%87%E4%BB%B6%E5%A4%B9
├── src               源码目录
│   ├── api             请求后台接口的目录
│   ├── assets          项目用到的静态图片目录
│   ├── components      组件目录
│   ├── icons           图标目录
│   ├── layout          页面布局目录
│   ├── store           状态管理(vuex)
│   ├── styles          样式文件目录
│   ├── utils           工具目录
│   ├── views           页面目录
│   │
│   │    !!!上面的是目录, 下面是文件!!!
│   │
│   ├── App.vue         也不是很懂 public/index.html 和 main.js 和 App.vue 三者为什么要搞这么复杂
│   ├── config.js       项目全局配置
│   ├── main.js         程序入口, 初始化 vue 实例、样式、插件、公共组件
│   ├── permission.js   权限控制(调度路由), 建一个同名目录, 里面放一个 index.js 是一样的
│   └── router.js       路由管理, 建一个同名目录, 里面放一个 index.js 是一样的
│
├── .babelrc          打包时将一些语法(比如 import('/a/b/c') 这种)转换成 es 标准的工具配置
├── .editorconfig     编辑器配置, 给 ide 用的
├── .env.development  本地开发的配置文件
├── .env.production   生产环境的配置文件
├── .env.staging      测试环境的配置文件
├── .eslintignore     不需要格式化的配置文件
├── .eslintrc.js      格式化代码的配置
├── jsconfig.json     给 ide 用的 js 配置, 见: https://code.visualstudio.com/docs/languages/jsconfig
├── package.json      项目配置
├── vue.config.js     运行 npm run .. 命令时 vue-cli-service 使用的配置(比如要修改端口时)
└── yarn.lock         项目版本相关的锁定文件(用 npm 命令会生成 package-lock.json)
```

node 系的版本号是一个灾难, 比如有这么三个版本号
```
"1.0.1"   表示指定的版本
"~1.0.1"  表示 1.0.X 中最新的版本
"^1.0.1"  表示 1.X.X 中最新的版本
```
更要命的是即便项目中都是指定版本, 但是那些包里面是可能会依赖带有 `~^` 的其他包的, 为了避免同一份代码不同的打包环境导致的差异, 于是衍生出了 yarn.lock 这样的锁定文件.
**宽松不严谨的选项带来数之不尽的麻烦!**


PS: 使用 `yarn cache dir` 命令可以查看 yarn 的本地缓存目录, 跟 npm 命令相比下面的命令是等同的
```conf
yarn             ===    npm install
yarn add x       ===    npm install x --save
yarn remove x    ===    npm uninstall x --save
yarn add x --dev ===    npm install x --save-dev
yarn upgrade     ===    npm update --save
```
