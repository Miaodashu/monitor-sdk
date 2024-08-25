import {
    StoreType,
    BasePluginType,
    CustomerOptionType,
    PageLifeType,
    ReportDataMsgType,
    ReportDataType,
    BrowserStackTypes,
    EventTypes,
    BrowserErrorTypes
} from '@monitor-sdk/types';
import { CollectedType, LifecycleDataType, LifecycleOptions } from '../types';
import { formatDate, generateUUID, getCookie, getDeepPropByDot, getStore } from '@monitor-sdk/utils';

export default function lifecycle(options: LifecycleOptions = {}): BasePluginType {
    const { userIdentify = {} } = options;
    return {
        name: 'lifecyclePlugin',
        monitor: (publish: (data: LifecycleDataType) => void) => {
            
            const { name: userPath, postion: userPosi } = userIdentify;
            this.sessionID = generateUUID();
            window.addEventListener('load', () => {
                const user_id = getStoreUserId(userIdentify) || '';
                if (userPath && userPosi && !user_id) {
                    this.log(`${userPath} does not exist on ${userPosi}`);
                }
                this.userID = user_id
                publish({
                    type: PageLifeType.LOAD,
                    session_id: this.sessionID,
                    time: formatDate(),
                    user_id,
                    href: location.href
                });
            });
            window.addEventListener('unload', () => {
                const user_id = getStoreUserId(userIdentify) || '';
                if (userPath && userPosi && !user_id) {
                    this.log(`${userPath} does not exist on ${userPosi}`);
                }
                publish({
                    type: PageLifeType.UNLOAD,
                    session_id: this.sessionID,
                    time: formatDate(),
                    user_id,
                    href: location.href
                });
            });
        },
        beforeReport: (data: LifecycleDataType): ReportDataType<ReportDataMsgType> => {
            const id = generateUUID();
            const { type, href, time } = data;
            let action;
            switch (type) {
                case PageLifeType.LOAD:
                    action = 'Enter';
                    break;
                case PageLifeType.UNLOAD:
                    action = 'Leave';
                    break;
                default:
                    break;
            }
            this.queue.enqueue({
                eventId: id,
                type: BrowserStackTypes.LIFECYCLE,
                message: `${action || type} "${href}"`
            });
            return {
                st: time,
                type: EventTypes.LIFECYCLE,
                data: {
                    sub_type: type,
                    ...data
                }
            };
        }
    };
}

function getStoreUserId(userIdentify: CustomerOptionType = {}) {
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
