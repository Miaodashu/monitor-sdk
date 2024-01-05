import { umdPackage, iifePackage} from '../../rollup.base.config.mjs';
// iife 增加自调用逻辑
const footer = `if (window.__MONITOR_OPTIONS__ && MONITOR_BROWSER) {MONITOR_BROWSER(window.__MONITOR_OPTIONS__);}\n`;

export default [umdPackage, {
    ...iifePackage,
    output: {
        ...iifePackage.output,
        footer
    }
}];
