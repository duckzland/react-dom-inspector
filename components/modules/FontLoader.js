import { forEach, set, find} from 'lodash';


export default class FontLoader {
    static library = null
    static googleAPI = null;
    static isFetching = false;
    static families = null;

    constructor(API = false) {
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

            XHR.open('get', 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + FontLoader.googleAPI);
            XHR.send();
        });
    }

    getFamily(defaultFamily = {}) {

        if (FontLoader.families === null) {
            if (FontLoader.library && FontLoader.library.items) {
                FontLoader.families = defaultFamily;
                forEach(FontLoader.library.items, (font) => {
                    FontLoader.families[font.family] = font.family;
                });
            }
            else {
                return defaultFamily;
            }
        }

        return FontLoader.families;
    }

    // @todo refactor this. this is messy
    getWeight(family = false, style = false, weight =  false, defaultWeight = {}) {

        if (FontLoader.library && FontLoader.library.items) {
            let TargetFamily = find(FontLoader.library.items, ['family', family])
            if (TargetFamily) {
                let TrackedWeight = {};
                forEach(TargetFamily.variants, (rule) => {
                    if (style) {
                        if (style === 'regular') {
                            let maybeRule = rule.match(/\d+/g),
                                maybeStyle = rule.match(/[a-zA-Z]+/g);
                            if (maybeRule && maybeRule[0] && !maybeStyle) {
                                TrackedWeight[maybeRule[0]] = maybeRule[0];
                            }
                        }
                        else {
                            let maybeStyle = rule.match(/[a-zA-Z]+/g);
                            if (maybeStyle && maybeStyle[0] === style) {
                                let Rule = rule.replace(maybeStyle[0], '');
                                Rule.length ? TrackedWeight[Rule] = Rule : false;
                            }
                        }
                    }
                    else {
                        let maybeRule = rule.match(/\d+/g);
                        if (maybeRule && maybeRule[0]) {
                            TrackedWeight[maybeRule[0]] = maybeRule[0];
                        }
                    }
                });

                return TrackedWeight;
            }
        }
        return defaultWeight;
    }

    // @todo refactor this. this is messy
    getStyle(family = false, style = false, weight = false, defaultStyle = {}) {

        if (FontLoader.library && FontLoader.library.items) {
            let TargetFamily = find(FontLoader.library.items, ['family', family])
            if (TargetFamily) {
                let TrackedStyle = {};
                forEach(TargetFamily.variants, (rule) => {
                    if (weight) {
                        let maybeWeight =  rule.match(/\d+/g);
                        if (maybeWeight && parseInt(maybeWeight[0]) === parseInt(weight)) {
                            let Rule = rule.replace(maybeWeight[0], '');
                            Rule.length ? TrackedStyle[Rule] = Rule : TrackedStyle['regular'] = 'regular';
                        }
                    }
                    else {
                        let maybeRule =  rule.match(/[a-zA-Z]+/g);
                        if (maybeRule && maybeRule[0]) {
                            TrackedStyle[maybeRule[0]] = maybeRule[0];
                        }
                    }
                });

                return TrackedStyle;
            }
        }
        return defaultStyle;
    }
}