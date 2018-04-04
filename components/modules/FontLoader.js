import { forEach, find, get, isEqual, isEmpty, indexOf} from 'lodash';
import WebFontLoader from 'webfontloader';

/**
 * Class for creating a fontloader object for easy loading, verification and injecting
 * fonts including google fonts.
 *
 * @author jason.xie@victheme.com
 */
export default class FontLoader {

    static library = null;
    static googleAPI = null;
    static isFetching = false;
    static families = null;
    static frame = null;
    static queues = [];

    constructor(API = false, frame = false) {
        FontLoader.googleAPI = API;

        if (!FontLoader.frame && frame) {
            FontLoader.frame = frame;
        }

        if (API && FontLoader.library === null && !FontLoader.isFetching) {
            FontLoader.isFetching = true;
            setTimeout(() => {
                this.load();
            }, 1);
        }
    }

    load = () => {
        const { processQueue } = this;
        return new Promise(function(resolve, reject) {
            let XHR = new XMLHttpRequest();

            XHR.responseType = 'json';
            XHR.onreadystatechange = function() {
                if (XHR.readyState == 4 && XHR.status == 200) {
                    FontLoader.library = XHR.response;
                    processQueue();
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
    };

    defer(fn, context = this, args = []) {
        FontLoader.isFetching
            ? FontLoader.queues.push({function: fn, context: context, args: args })
            : fn.apply(context, args);
    }

    processQueue() {
        forEach(FontLoader.queues, (queue) => {
            queue.function.apply(queue.context, queue.args);
        });

        FontLoader.queues = [];

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
                font.variants && forEach(font.variants, (rule) => {

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

                font.variants && forEach(font.variants, (rule) => {

                    const fontWeight = rule.match(/\d+/g);
                    const fontRule = rule.match(/[a-zA-Z]+/g);
                    const Rule = fontWeight && fontWeight[0]
                        ? rule === fontWeight[0]
                            ? 'regular'
                            : rule.replace(fontWeight[0], '')
                        : false;

                    switch (weight) {
                        case 'none' :
                            fontRule && fontRule[0] && (fontStyle[fontRule[0]] = fontRule[0]);
                            break;
                        default :
                            fontWeight
                                && Rule
                                && (parseInt(fontWeight[0]) === parseInt(weight))
                                && Rule.length
                                && (fontStyle[Rule] = Rule.replace(/(?:^|\s)\S/g, function (a) {
                                    return a.toUpperCase();
                                }));
                            break;
                    }
                });

                return fontStyle;
            }

        }

        return defaultStyle;
    }

    validate(family = false, style = '', weight = '') {

        if ((style === 'regular' || style === 'normal') && weight) {
            style = '';
        }

        const checkedRule = weight + style;
        let validated = false,
            font = false;

        if (family && FontLoader.families !== null && !get(FontLoader.families, family, false)) {
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

    insert(family = false, style= '', weight = '') {
        let loaded = false;
        if (family && FontLoader.library && FontLoader.library.items) {
            const font = find(FontLoader.library.items, ['family', family]);
            if (font) {
                const variant = weight + style;
                const rule = (variant ? family + ':' + variant : family).replace(' ', '+');

                WebFontLoader.load({
                    google: {
                        families: [rule]
                    },
                    context: FontLoader.frame
                });
                loaded = true;
            }
        }

        return loaded;
    }

    isGoogleFont(family) {
        return find(FontLoader.library.items, { family: family }) ? true : false;
    }

    parseFont(storage = false, loadFont = false) {

        const sheet = storage.sheet ? storage.sheet : storage.styleSheet,
              Docs = FontLoader.frame ? FontLoader.frame.document : false,
              CS = FontLoader.frame ? FontLoader.frame.window.getComputedStyle : false,
              fonts = [];

        Docs
            && CS
            && sheet
            && sheet.cssRules
            && forEach(sheet.cssRules, (rule) => {

                // Don't trust sheet rules, use computed value instead!
                let Element = Docs.querySelector(rule.selectorText),
                    Style = Element ? CS(Element, null) : false,
                    families  = Style ? get(Style, 'fontFamily', '').split(',') : [];

                if (!families.length) {
                    return true;
                }

                forEach(families, (family) => {

                    family = family.replace(/"/g,"").trim();

                    let storedFont = find(fonts, { family: family }),
                        weight = get(Style, 'fontWeight', ''),
                        style = get(Style, 'fontStyle', ''),
                        variant = weight + style,
                        font = storedFont ? storedFont : {
                            family: family,
                            googleFont: false,
                            weight: new Set(),
                            style: new Set(),
                            rule: new Set()
                        };

                    font.googleFont = this.isGoogleFont(family);

                    if (weight) {
                        font.weight.add(weight);
                    }

                    if (style) {
                        font.style.add(style);
                    }

                    if (this.validate(family, style, weight)) {
                        font.rule.add(variant);
                        loadFont && this.insert(family, style, weight);
                    }

                    if (!isEmpty(font) && isEmpty(storedFont)) {
                        fonts.push(font);
                    }
                });
            });

        return fonts;
    };
}