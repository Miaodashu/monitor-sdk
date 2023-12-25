// 存储在数据结构中的类型， 做个细致化划分
export enum BrowserStackTypes {
    ROUTE = 'Route',
    CLICK = 'UI.Click',
    CONSOLE = 'Console',
    XHR = 'Xhr',
    FETCH = 'Fetch',
    UNHANDLEDREJECTION = 'Unhandledrejection',
    RESOURCE = 'Resource',
    CODE_ERROR = 'CodeError',
    CUSTOMER = 'Customer',
    FRAMEWORK = 'Framework',
    LIFECYCLE = 'LifeCycle',
    CRASH = 'Crash'
}

// 订阅的事件类型  / 上报的数据类型
export enum EventTypes {
    API = 'api', // 接口类型  接口，请求 报错
    DOM = 'dom', // dom 事件
    PERFORMANCE = 'performance', // 性能监控
    ROUTE = 'route', // 路由变化
    ERROR = 'error', // 错误
    CONSOLE = 'console', // log
    CUSTOMER = 'customer', // 自定义事件
    VUE = 'vue', // vue
    LIFECYCLE = 'lifeCycle', // vue生命周期
    EXTEND = 'extend', // 扩展
    RECORD = 'record' // 记录
}

// 数据队列或者栈中 数据的level
export enum StackQueueLevel {
    FATAL = 'fatal',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
}

// log日志level， 让sdk内的log做下区分
export enum ConsoleTypes {
    LOG = 'log',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

// 浏览器端上报数据中子类型
export type BrowserSubTypes = BrowserErrorTypes | ConsoleTypes | PerTypes | RouteTypes | CustomerTypes | HttpTypes;

// 浏览器端上报数据中错误子类型
export enum BrowserErrorTypes {
    CODEERROR = 'code', // 代码错误
    RESOURCEERROR = 'resource', // 资源错误
    UNHANDLEDREJECTION = 'unhandledrejection', // promise错误
    PAGECRASH = 'pageCrash', // 页面崩溃
    CLICK = 'click' // 点击事件
}

export enum HttpTypes {
    FETCH = 'fetch',
    XHR = 'xhr'
}

export enum PerTypes {
    FMP = 'fmp',
    FPS = 'fps',
    BASIC = 'basic',
    VITALS = 'vitals',
    RESOURCE = 'resource'
}

export enum RouteTypes {
    HASH = 'hash',
    HISTORY = 'history'
}

export enum PageLifeType {
    LOAD = 'enter',
    UNLOAD = 'leave'
}

export enum CustomerTypes {
    CUSTOMER = 'customer'
}

// 存储类型  为了区分数据存储在哪里
export type StoreTypes = 'local' | 'session' | 'cookie' | 'global';

export enum StoreType {
    LOCAL = 'local',
    SESSION = 'session',
    COOKIE = 'cookie',
    GLOBAL = 'global'
}

// 浏览器端 数据上报方式
export enum BrowserReportType {
    BEACON = 'beacon',
    IMG = 'img',
    GET = 'get',
    POST = 'post'
}

// xhr 请求类型
export enum MethodTypes {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

// 定义端口类型
export enum PlatformTypes {
    BROWSER = 'browser', // 浏览器
    NODE = 'nodejs', // node
    WECHAT = 'wechat' // 小程序
}
