

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

export enum WxStackTypes {
    API = 'Api',
    ROUTE = 'Route',
    CLICK = 'UI.Click',
    ERROR = 'Error',
    LIFECYCLE = 'LifeCycle',
    CUSTOMER = 'Customer'
}

export enum EventTypes {
    API = 'api',
    DOM = 'dom',
    PERFORMANCE = 'performance',
    ROUTE = 'route',
    ERROR = 'error',
    CONSOLE = 'console',
    CUSTOMER = 'customer',
    VUE = 'vue',
    LIFECYCLE = 'lifeCycle',
    EXTEND = 'extend',
    RECORD = 'record'
}
export enum StackLevel {
    FATAL = 'fatal',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
}


export enum ConsoleTypes {
    LOG = 'log',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}