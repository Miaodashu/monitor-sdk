export interface AppInfoType {
    name: string;
    leader: string;
    desc?: string;
}

export interface DSN {
    /**
     * 上报的域名地址
     */
    host: string;
    /**
     * 应用初始化接口地址
     */
    init: string;
    /**
     * 信息上报接口地址
     */
    url: string;
}