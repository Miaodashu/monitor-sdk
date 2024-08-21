interface TcTraObj {
    _tcTrackEvent: (category: string, action: string, label: any, value: string, eventId: string) => void;
    _tcTrackEventNew: (category: string, action: string, label: any, value: string, eventId: string) => void;
}
// declare global {
//     interface Window {
//         _tcTraObj: TcTraObj;
//     }
// }
// window全局对象属性
declare interface Window {
    // 轨迹埋点对象
    _tcTraObj: TcTraObj
    _tcq: any[]
    _timediff: any
    _tcopentime: any
  }