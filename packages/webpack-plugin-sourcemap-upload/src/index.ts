import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

const TAG = '[webpack-plugin-sourcemap-upload]: ';

class UploadSourceMapPlugin {
    private readonly options;

    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.done.tapAsync('upload-sourcemap-plugin', async (status: { compilation: { outputOptions: { path: string } } }) => {
            const outputPath = status.compilation.outputOptions.path;
            const files = fs.readdirSync(outputPath);
            const list = files.filter((filename) => filename.endsWith('.js.map'));
            if (!list.length) {
                console.warn(TAG, 'map files not found');
                return;
            }
            for (const file of list) {
                try {
                    await this.upload(path.join(outputPath, file));
                } catch (err) {
                    console.error(TAG, err);
                }
            }
            console.log(TAG, 'upload finished');
            process.exit();
        });
    }

    upload(filePath: string): Promise<ResponseType> {
        return new Promise((resolve, rejected) => {
            const { url, appname, errcode = 'code', errmsg = 'msg' } = this.options;
            if (!url || !appname) {
                rejected({ code: -1, msg: 'missing url or appname in options' });
            }

            const fileStream = fs.createReadStream(filePath);
            const filename = path.basename(filePath);
            const formData = new FormData();
            formData.append('file', fileStream);
            formData.append('dirname', appname);
            formData.append('filename', filename);
            const headers = formData.getHeaders();

            //获取form-data长度
            formData.getLength(async function (err, length) {
                if (err) {
                    return;
                }
                //设置长度，important!!!
                headers['content-length'] = length;

                await axios
                    .post(url, formData, { headers })
                    .then((res) => {
                        console.log('上传成功', res.data);
                        resolve(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                        rejected(err)
                    });
            });
        });
    }
}

export default UploadSourceMapPlugin;
