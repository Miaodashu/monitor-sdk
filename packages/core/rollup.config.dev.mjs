import { iifePackage } from '../../rollup.base.config.mjs'

iifePackage.output = {
    ...iifePackage.output,
    sourcemap: true,
}

export default [iifePackage]