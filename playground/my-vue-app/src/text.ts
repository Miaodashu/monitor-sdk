import { minimatch } from 'minimatch';


export function minimatchFn(p: string, pattern: string) {
    return minimatch(p, pattern);
}
