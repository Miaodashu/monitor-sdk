import { StoreTypes } from './constant';

export interface CustomerOptionType {
    name?: string; // 存储的值的访问路径 比如 userinfo.name
    postion?: StoreTypes; // 存储的位置
  }