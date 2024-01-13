const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const TAG = '[webpack-plugin-sourcemap-upload]: ';

class UploadSourceMapPlugin {
    options;

    constructor(options) {
        this.options = options;
    }
    apply2(compiler) {
        compiler.plugin('done', async stats => {
            const outputPath = stats.compilation.outputOptions.path;
            const filter = filename => filename.endsWith('.js.map');

            const list = this.readFilesRecursively(outputPath, filter);
            if (!list.length) {
                console.warn(TAG, 'map文件没有发现');
                return;
            }
            console.log(TAG, '开始上传------');
            for (const file of list) {
                try {
                    await this.upload(file);
                    console.log(TAG, `上传成功: ${file}`);
                } catch (err) {
                    console.error(TAG, err);
                }
            }
            console.log(TAG, '上传完成');
            if (this.options.delTarget) {
                await this.removeFile(list);
                console.log(TAG, '删除map文件完成');
            }
            process.exit();
        });
    }
    apply(compiler) {
        compiler.hooks.done.tapAsync('upload-sourcemap-plugin', async stats => {
            const outputPath = stats.compilation.outputOptions.path;
            const filter = filename => filename.endsWith('.js.map');

            const list = this.readFilesRecursively(outputPath, filter);
            if (!list.length) {
                console.warn(TAG, 'map文件没有发现');
                return;
            }
            for (const file of list) {
                try {
                    await this.upload(file);
                } catch (err) {
                    console.error(TAG, err);
                }
            }
            console.log(TAG, '上传完成');
            if (this.options.delTarget) {
                await this.removeFile(list);
                console.log(TAG, '删除map文件完成');
            }
            process.exit();
        });
    }
    /**
     * 递归读取指定目录下的所有文件，并返回符合条件的文件路径列表。
     *
     * @param dir 目录路径
     * @param filter 过滤函数，用于判断文件是否符合条件，返回值为布尔值
     * @returns 符合条件的文件路径列表
     */
    readFilesRecursively(dir, filter) {
        const files = fs.readdirSync(dir);

        const matchedFiles = [];

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                matchedFiles.push(...this.readFilesRecursively(filePath, filter));
            } else if (filter(filePath)) {
                matchedFiles.push(filePath);
            }
        });

        return matchedFiles;
    }
    /**
     * 删除文件
     *
     * @param list 文件列表
     * @returns 返回一个Promise对象，当所有文件删除成功时resolve，否则reject
     */
    upload(filePath) {
        return new Promise((resolve, rejected) => {
            const { url, appname, errcode = 'code', errmsg = 'msg' } = this.options;
            if (!url || !appname) {
                rejected({ code: -1, msg: 'missing url or appname in options' });
            }
            const formData = new FormData();

            const fileStream = fs.createReadStream(filePath);
            const filename = path.basename(filePath);

            formData.append('file', fileStream);
            formData.append('dirname', 'appname');
            formData.append('filename', filename);
            var configs = {
                headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }
            };
            axios
                .post(`${url}?dirname=${appname}&filename=${filename}`, formData, configs)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.log(err);
                    rejected(err);
                });
        });
    }
    /**
     * 删除文件
     *
     * @param list 文件列表
     * @returns 返回一个Promise，当所有文件删除成功时，resolve返回已删除的文件列表；否则，reject返回错误信息。
     */
    removeFile(list) {
        return new Promise((resolve, reject) => {
            for (const file of list) {
                fs.unlink(file, err => {
                    if (err) {
                        console.error(`删除文件失败: ${err}`);
                        reject(err);
                        return;
                    }
                    resolve(file);
                });
            }
        });
    }
}

module.exports = UploadSourceMapPlugin;


