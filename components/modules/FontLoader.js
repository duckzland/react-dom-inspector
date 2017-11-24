import { forEach, set} from 'lodash';


export default class FontLoader {
    static library = null
    static googleAPI = null;
    static isFetching = false;

    constructor(API = false) {
        console.log(API);
        console.log(FontLoader.isFetching);
        if (API && FontLoader.library === null && !FontLoader.isFetching) {
            FontLoader.isFetching = true;
            FontLoader.googleAPI = 'AIzaSyBGkmctzcaXne1HFbZKYz6iq9i6ROrVeaE';
            setTimeout(() => {
                this.load();
            }, 1);
        }
    }

    load() {
        return new Promise(function(resolve, reject) {
            let XHR = new XMLHttpRequest();

            XHR.responseType = 'json';
            XHR.onreadystatechange = function() {
                if (XHR.readyState == 4 && XHR.status == 200) {
                    FontLoader.library = XHR.response;
                }
                FontLoader.isFetching = false;
                resolve(XHR.response);
            };

            XHR.onerror = function(e) {
                FontLoader.isFetching = false;
                reject(Error("Network Error"));
            };

            XHR.open('get', 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + FontLoader.googleAPI)
            XHR.send();
        });
    }

    getFamily(defaultFamily = {}) {
        return defaultFamily;
    }

    getWeight(family = false, defaultWeight = {}) {
        return defaultWeight;
    }

    getStyle(family = false, defaultStyle = {}) {
        return defaultStyle;
    }
}