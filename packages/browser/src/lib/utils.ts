import { CustomerOptionType, StoreType } from "@tc-track/types"
import { getCookie, getDeepPropByDot, getStore, isFunction, isObject } from "@tc-track/utils"


export function getStoreUserId(userIdentify: CustomerOptionType = {}) {
    const { name = '', postion = '' } = userIdentify;
    switch (postion) {
        case StoreType.LOCAL:
        case StoreType.SESSION:
            return getStore(postion, name);
        case StoreType.COOKIE:
            return getCookie(name);
        case StoreType.GLOBAL:
            return getDeepPropByDot(name, window);
        default:
            break;
    }
}
/**
* 获取扩展信息
*/
export function getExtendsInfo(data: any){
   try {
       let ret = {};
       let extendsInfo = data || {};
       let dynamicParams;
       if(isFunction(extendsInfo.getDynamic)){
           dynamicParams = extendsInfo.getDynamic();   //获取动态参数
       }
       //判断动态方法返回的参数是否是对象
       if(isObject(dynamicParams)){
           extendsInfo = {...extendsInfo,...dynamicParams};
       }
       //遍历扩展信息，排除动态方法
       for(var key in extendsInfo){
           if(!isFunction(extendsInfo[key])){    //排除获取动态方法
               ret[key] = extendsInfo[key];
           }
       }
       return ret;
   } catch (error) {
    //    console.log('call getExtendsInfo error',error); 
   }
   return null;
}