import { forEach, find, filter, remove } from 'lodash';

/**
 * Class for managing images
 *
 * Expected json structure for the image library:
 *
 * [
 *  {
 *      id: uniqueID,
 *      filename: the image filename,
 *      url: the image url,
 *      thumb: the image thumb if available
 *  },
 *  {
 *      id: uniqueID,
 *      filename: the image filename,
 *      url: the image url,
 *      thumb: the image thumb if available
 *  }
 * ]
 *
 * @author jason.xie@victheme.com
 */
export default class ImageLoader {

    config = {
        upload: {
            url: false,
            headers: {},
            onFailed: false,
            onError: false,
            onComplete: false,
        },
        fetch: {
            url: false,
            headers: {},
            onFailed: false,
            onError: false,
            onComplete: false
        },
        remove: {
            url: false,
            headers: {},
            onFailed: false,
            onError: false,
            onComplete: false
        }
    };

    static images = [];

    constructor(config, images = false) {
        Object.assign(this.config, config);
        images && this.set(images);
    }

    set = (images) => {
        ImageLoader.images = images;
    };

    get = (id) => {
        return find(ImageLoader.images, { id: id });
    };

    find = (filename) => {
        return find(ImageLoader.images, { filename: filename });
    };

    filter = (search) => {
        const result = [];
        forEach(ImageLoader.images, (object) => {
           if (object.filename.indexOf(search) !== -1) {
                result.push(object);
            }
        });

        return result;
    };

    thumbnail = (image) => {
        return image.thumb ? image.thumb : image.url ? image.url : '';
    };

    url = (image) => {
        return image.url ? image.url : '';
    };

    extract = () => {
        return ImageLoader.images;
    };

    remove = (id) => {
        const { config } = this;
        const { url, onError, onComplete, onFailed, headers } = config.remove;

        if (url) {
            const XHR = new XMLHttpRequest();
            return new Promise((resolve, reject) => {

                XHR.onreadystatechange = function(e) {
                    if (XHR.readyState == 4 && XHR.status == 200) {

                        let Response = JSON.parse(XHR.responseText);

                        if (Response.id && parseInt(Response.id) === parseInt(id)) {
                            remove(ImageLoader.images, { id: parseInt(id)});
                            onComplete && onComplete(e, XHR, this);
                        }
                        else {
                            onFailed && onFailed(e, XHR, this);
                        }
                    }

                    resolve(XHR.response);
                };

                XHR.onerror = function(e) {
                    onError && onError(e, XHR, this);
                    reject(Error("Network Error"));
                };

                headers && forEach(headers, (value, key) => {
                    XHR.setRequestHeader(key, value)
                });

                const Data = new FormData();
                Data.append('id', id);

                XHR.open('POST', url);
                XHR.send(Data);
            });
        }

        return false;
    };

    upload = (file, progress) => {

        const { config } = this;
        const { url, onError, onComplete, onFailed, headers } = config.upload;

        if (url) {
            const XHR = new XMLHttpRequest();
            const Data = new FormData();

            Data.append('FileUpload', file);

            return new Promise((resolve, reject) => {

                XHR.onreadystatechange = function(e) {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        let Response = JSON.parse(XHR.responseText);
                        if (Response.success) {
                            ImageLoader.images.push(Response.image);
                            onComplete && onComplete(e, XHR, this);
                        }
                        else {
                            onFailed && onFailed(e, XHR, this);
                        }
                    }

                    resolve();
                };

                XHR.upload.onprogress = function (e) {
                    if (progress && e.lengthComputable) {
                        progress.max = e.total;
                        progress.value = e.loaded;
                    }
                };

                XHR.upload.onloadstart = function (e) {
                    if (progress) progress.value = 0;
                };

                XHR.upload.onloadend = function (e) {
                    if (progress) progress.value = e.loaded;
                };

                XHR.onerror = function(e) {
                    onError && onError(e, XHR, this);
                    reject(Error("Network Error"));
                };

                headers && forEach(headers, (value, key) => {
                    XHR.setRequestHeader(key, value)
                });

                XHR.open('POST', url);
                XHR.send(Data);
            });
        }

        return false;
    };

    fetch = () => {
        const { config } = this;
        const { url, onError, onComplete, onFailed, headers } = config.fetch;

        if (url) {
            const XHR = new XMLHttpRequest();
            return new Promise((resolve, reject) => {

                XHR.onreadystatechange = function(e) {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        let Response = JSON.parse(XHR.responseText);

                        if (Response.success) {
                            ImageLoader.images = Response.images;
                            onComplete && onComplete(e, XHR, this);
                        }
                        else {
                            onFailed && onFailed(e, XHR, this);
                        }
                    }

                    resolve(XHR.response);
                };

                XHR.onerror = function(e) {
                    onError && onError(e, XHR, this);
                    reject(Error("Network Error"));
                };

                headers && forEach(headers, (value, key) => {
                    XHR.setRequestHeader(key, value)
                });

                XHR.open('POST', url);
                XHR.send();
            });
        }

        return false;
    };
}