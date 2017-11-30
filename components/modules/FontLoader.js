import { forEach, set, find, get, isEqual} from 'lodash';
import WebFontLoader from 'webfontloader';


export default class FontLoader {
    static library = null
    static googleAPI = null;
    static isFetching = false;
    static families = null;

    constructor(API = false) {
        FontLoader.googleAPI = API;
        if (API && FontLoader.library === null && !FontLoader.isFetching) {
            FontLoader.isFetching = true;
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
            FontLoader.families = defaultFamily;
        }

        if (isEqual(FontLoader.families, defaultFamily) && FontLoader.library && FontLoader.library.items) {
            FontLoader.families = defaultFamily;
            forEach(FontLoader.library.items, (font) => {
                FontLoader.families[font.family] = font.family;
            });
        }

        return FontLoader.families;
    }

    getWeight(family = false, style = false, weight =  false, defaultWeight = {}) {


        if (FontLoader.library && FontLoader.library.items) {
            const font = find(FontLoader.library.items, ['family', family]);
            if (font) {
                let fontWeight = {};
                font && font.variants && forEach(font.variants, (rule) => {

                    const fontStyle = rule.match(/[a-zA-Z]+/g);
                    const fontRule = rule.match(/\d+/g);

                    !style ? style = 'none' : null;

                    switch (style) {
                        case 'regular' :
                            !fontStyle && fontRule && fontRule[0] && (fontWeight[fontRule[0]] = fontRule[0]);
                            break;
                        case 'none' :
                            fontRule && fontRule[0] && (fontWeight[fontRule[0]] = fontRule[0]);
                            break;
                        default :
                            if (fontStyle && fontStyle[0] === style) {
                                const x = rule.replace(fontStyle[0], '');
                                x.length ? fontWeight[x] = x : false;
                            }
                            break;

                    }
                });
                return fontWeight;
            }
        }

        return defaultWeight;
    }

    getStyle(family = false, style = false, weight = false, defaultStyle = {}) {

        if (FontLoader.library && FontLoader.library.items) {
            const font = find(FontLoader.library.items, ['family', family]);
            if (font) {
                let fontStyle = {};
                !weight ? weight = 'none' : null;

                font && font.variants && forEach(font.variants, (rule) => {

                    const fontWeight = rule.match(/\d+/g);
                    const fontRule = rule.match(/[a-zA-Z]+/g);
                    const Rule = fontWeight && fontWeight[0] ? rule.replace(fontWeight[0], '') : false;

                    switch (weight) {
                        case 'none' :
                            fontRule && fontRule[0] && (fontStyle[fontRule[0]] = fontRule[0]);
                            break;
                        default :
                            if (fontWeight && parseInt(fontWeight[0]) === parseInt(weight)) {
                                Rule && Rule.length
                                    ? fontStyle[Rule] = Rule.replace(/(?:^|\s)\S/g, function (a) {
                                    return a.toUpperCase();
                                })
                                    : fontStyle['regular'] = 'Regular';
                            }
                            break;
                    }
                });

                return fontStyle;
            }

        }

        return defaultStyle;
    }

    validateFont(family = false, style = '', weight = '') {

        let validated = false;
        let font = false;
        const checkedRule = weight + style;

        if (family && !get(FontLoader.families, family, false)) {
            family = null;
            validated = false;
        }
        if (family && checkedRule === '') {
            validated = true;
        }
        else if (family && FontLoader.library && FontLoader.library.items) {
            font = find(FontLoader.library.items, ['family', family]);
            font && font.variants && forEach(font.variants, (rule) => {
                if (rule === checkedRule) {
                    validated = true;
                    return false;
                }
            });
        }

        if (!font && family !== null) {
            validated = true;
        }

        return validated;
    }

    insertFont(family = false, style= '', weight = '') {
        let loaded = false;
        if (family && FontLoader.library && FontLoader.library.items) {
            const font = find(FontLoader.library.items, ['family', family]);
            if (font) {
                const variant = style + weight;
                let rule = family;
                if (variant) {
                    rule += ':' + variant;
                }
                WebFontLoader.load({
                    google: {
                        families: [rule]
                    }
                });
                loaded = true;
            }
        }


        return loaded;
    }
}