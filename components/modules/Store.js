import { forEach, set} from 'lodash';
import Parser from './Parser';
import DOMHelper from './DOMHelper';

class Store {

    constructor(node, depth, selectors) {

        node.matches = node.matches
            || node.webkitMatchesSelector
            || node.mozMatchesSelector
            || node.msMatchesSelector
            || node.oMatchesSelector;

        if (!node.hasAttribute('stylizer-uuid')) {
            node.setAttribute('stylizer-uuid', this.generateUUID());
        }

        this.key = selectors.join(' > ');
        this.id = node.id;
        this.className = node.className && node.className.length ? node.className.split(' ') : [];
        this.tagName = node.nodeName.toLowerCase();
        this.depth = depth;
        this.tree = selectors;
        this.unit = selectors.slice(-1)[0];
        this.uuid = node.getAttribute('stylizer-uuid');
        this.hasChildren = this.detectChildElement(node);
        this.processed = false;
        this.refresh = false;
        this.active = false;

        this.generateSelector();
    };

    trackNode = () => {
        let node = document.querySelectorAll('[stylizer-uuid="' + this.uuid + '"]');
        return node.length !== 0 ? node[0] : false ;
    };

    detectChildElement = (node) => {
        var child, rv = false;

        for (child = node.firstChild; !rv && child; child = child.nextSibling) {
            if (child.nodeType === node.ELEMENT_NODE && child.nodeName.toLowerCase() !== 'img') {
                rv = true;
            }
        }

        return rv;
    };

    validateSelector = (selector, node = false) => {
        if (!node) {
            node = this.trackNode();
        }

        return node ? node.matches(selector) : false;
    };

    generateUUID = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    };

    generateStylingFromAllStylesheets = () => {

        let node = this.trackNode(), sheets = document.styleSheets;

        this.styles = {};

        if (node) {
            for (let i in sheets) {
                let sheet = sheets[i],
                    rules = sheet.rules || sheet.cssRules;

                for (let r in rules) {
                    if (node.matches(rules[r].selectorText)) {
                        let parsed = new Parser(rules[r].cssText);
                        for (let x in parsed) {
                            for (let y in parsed[x].rules) {

                                let directive = parsed[x].rules[y].directive,
                                    value = parsed[x].rules[y].value;

                                elements.removeAttribute('style');
                                elements.setAttribute('style', directive + ': ' + value);

                                switch (directive) {
                                    case 'border-radius' :
                                    case 'padding' :
                                    case 'margin' :
                                        ['top', 'left', 'right', 'bottom'].map((dir) => {
                                            let path = directive + '-' + dir;
                                            set(this.styles, path, elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                        });
                                        break;

                                    case 'border-left' :
                                    case 'border-right' :
                                    case 'border-top' :
                                    case 'border-bottom' :
                                    case 'border' :
                                        forEach((directive === 'border' ? [directive] : ['border-top', 'border-left', 'border-right', 'border-bottom']), (dir) => {
                                            ['width', 'style', 'color'].map((type) => {
                                                let path = dir + '-' + type;
                                                set(this.styles, path, elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                            });
                                        });

                                        break;

                                    case 'font' :
                                        ['style', 'variant', 'weight', 'stretch', 'size', 'family', 'height'].map((type) => {
                                            let path = 'font-' + type;
                                            set(this.styles, path, elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                        });
                                        break;

                                    case 'background' :
                                        ['color', 'image', 'position', 'repeat', 'attachment', 'size', 'clip', 'origin'].map((type) => {
                                            let path = 'background-' + type;
                                            set(this.styles, path, elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                        });
                                        break;

                                    default :
                                        set(this.styles, parsed[x].rules[y].directive, parsed[x].rules[y].value);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    generateStyling = () => {

        let node = this.trackNode();

        this.styles = {};
        if (!node) {
            return;
        }

        let rules = (new DOMHelper()).styleSheet({id: 'jxdev-stylizer'}, 'content'),
            elements = document.createElement('span');

        for (let r in rules) {
            if (this.validateSelector(rules[r].selectorText, node)) {
                let parsed = new Parser(rules[r].cssText);
                for (let x in parsed) {
                    for (let y in parsed[x].rules) {

                        let directive = parsed[x].rules[y].directive,
                            value = parsed[x].rules[y].value;

                        elements.removeAttribute('style');
                        elements.setAttribute('style', directive + ': ' + value);

                        switch (directive) {
                            case 'border-radius' :
                            case 'padding' :
                            case 'margin' :
                                ['top', 'left', 'right', 'bottom'].map((dir) => {
                                    let path = directive + '-' + dir;
                                    set(this.styles, path, elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                });
                                break;

                            case 'border-left' :
                            case 'border-right' :
                            case 'border-top' :
                            case 'border-bottom' :
                            case 'border' :
                                forEach((directive === 'border' ? [directive] : ['border-top', 'border-left', 'border-right', 'border-bottom']), (dir) => {
                                    ['width', 'style', 'color'].map((type) => {
                                        let path = dir + '-' + type;
                                        set(this.styles, path, elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                    });
                                });

                                break;

                            case 'font' :
                                ['font-style', 'font-variant', 'font-weight', 'font-stretch', 'font-size', 'font-family', 'line-height'].map((type) => {
                                    set(this.styles, type, elements.style[type.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                });
                                break;

                            case 'background' :
                                ['color', 'image', 'position', 'repeat', 'attachment', 'size', 'clip', 'origin'].map((type) => {
                                    let path = 'background-' + type;
                                    set(this.styles, path, elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })]);
                                });
                                break;

                            default :
                                set(this.styles, parsed[x].rules[y].directive, parsed[x].rules[y].value);
                        }
                    }
                }
            }
        }

    };

    storeSelector = (value) => {
        this.selector = value;
    };

    storeStyling = (target, value) => {
        set(this.styles, target, value);
    };

    getStyling = () => {
        let rules = [];
        forEach(this.styles, (value, rule) => {
            rules.push(rule + ': ' + value + ';');
        });
        return this.selector + ' {' + rules.join(' ') + '}';
    };

    generateSelector = () => {
        let keys = [], reversedSelector = this.tree.slice(0).reverse();
        forEach(reversedSelector, (selector) => {
            keys.push(selector);
            if (selector.indexOf('.') !== -1 || selector.indexOf('#') !== -1) {
                return false;
            }
        });

        this.selector = keys.reverse().join(' > ');
    };

}

export default Store;