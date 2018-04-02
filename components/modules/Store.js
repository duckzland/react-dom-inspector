import { forEach, set, get } from 'lodash';
import Parser from './Parser';
import DOMHelper from './DOMHelper';

/**
 * Class for Linking between Node and Dom inspector
 *
 * @author jason.xie@victheme.com
 */
export default class Store {

    config = {
        domID: 'dom-inspector',
        sheetID: 'stylizer-source',
        stylizerAttribute: 'stylizer-uuid',
        disallowNodeName: 'img|script|style|link'
    };

    constructor(node, depth, tree, config = false) {

        config && Object.assign(this.config, config);

        this.document = node.ownerDocument;
        node.matches = node.matches
            || node.webkitMatchesSelector
            || node.mozMatchesSelector
            || node.msMatchesSelector
            || node.oMatchesSelector;

        if (!node.hasAttribute(this.config.stylizerAttribute)) {
            node.setAttribute(this.config.stylizerAttribute, this.generateUUID());
        }

        this.key = tree.join(' > ');
        this.id = node.id;
        this.className = node.className && node.className.length ? node.className.split(' ') : [];
        this.tagName = node.nodeName.toLowerCase();
        this.depth = depth;
        this.tree = tree;
        this.unit = tree.slice(-1)[0];
        this.uuid = node.getAttribute(this.config.stylizerAttribute);
        this.hasChildren = this.detectChildElement(node);
        this.processed = false;
        this.refresh = false;
        this.active = false;
        this.changed = false;

        this.generateSelector();
    };

    trackNode = () => {
        let node = this.document.querySelectorAll('[' + this.config.stylizerAttribute + '="' + this.uuid + '"]');
        return node.length !== 0 ? node[0] : false ;
    };

    detectChildElement = (node) => {
        var child, rv = false;

        for (child = node.firstChild; !rv && child; child = child.nextSibling) {
            if (child.nodeType === node.ELEMENT_NODE
                && !child.nodeName.toLowerCase().match(new RegExp('(' + this.config.disallowNodeName + ')', 'g'))) {
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

    generateStyling = (reset = false) => {

        if (this.styles && !reset) {
            return this.styles;
        }

        let node = this.trackNode();

        this.resetStyle();
        if (!node) {
            return;
        }

        let rules = (new DOMHelper(this.document)).styleSheet({ id: this.getSheetID() }, 'content'),
            elements = this.document.createElement('span'),
            skippedRule = new RegExp('(initial|inherit)', 'g');

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

                            case 'padding' :
                            case 'margin' :
                                ['top', 'left', 'right', 'bottom'].map((dir) => {
                                    let path = directive + '-' + dir,
                                        style = elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })];
                                    if (style && !style.match(skippedRule)) {
                                        set(this.styles, path, style);
                                    }
                                });
                                break;

                            case 'border-left' :
                            case 'border-right' :
                            case 'border-top' :
                            case 'border-bottom' :
                            case 'border' :
                                forEach((directive !== 'border' ? [directive] : ['border']), (dir) => {
                                    ['width', 'style', 'color'].map((type) => {
                                        let path = dir + '-' + type,
                                            style = elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })];
                                        if (style && !style.match(skippedRule)) {
                                            set(this.styles, path, style);
                                        }
                                    });
                                });
                                break;

                            case 'outline' :
                                ['width', 'style', 'color'].map((type) => {
                                    let path = 'outline-' + type,
                                        style = elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })];
                                    if (style && !style.match(skippedRule)) {
                                        set(this.styles, path, style);
                                    }
                                });
                                break;

                            case 'font' :
                                ['font-style', 'font-variant', 'font-weight', 'font-stretch', 'font-size', 'font-family', 'line-height'].map((path) => {
                                    let style = elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })].replace(/"/g, '');
                                    if (style && !style.match(skippedRule)) {
                                        set(this.styles, path, style);
                                    }
                                });
                                break;

                            case 'background' :
                                ['color', 'image', 'position', 'repeat', 'attachment', 'size', 'clip', 'origin'].map((type) => {
                                    let path = 'background-' + type,
                                        style = elements.style[path.replace(/\s(-)/g, function($1) { return $1.toUpperCase(); })];
                                    if (style && !style.match(skippedRule)) {
                                        set(this.styles, path, style);
                                    }
                                });
                                break;

                            default :
                                let style = parsed[x].rules[y].value;
                                if (style && !style.match(skippedRule)) {
                                    set(this.styles, parsed[x].rules[y].directive, style);
                                }
                        }
                    }
                }
            }
        }

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

    storeSelector = (value) => {
        this.selector = value;
        this.changed = true;
    };

    getSheetID = () => {
        if ('root' in this.config && 'getStyleSourceID' in this.config.root) {
            return this.config.root.getStyleSourceID();
        }

        if (this.config.sheetID) {
            return this.config.sheetID;
        }
        return false;
    };

    getStyle = (target) => {
        return get(this.styles, target, '');
    };

    removeStyle = (target) => {
       delete this.styles[target];
    };

    resetStyle = () => {
        this.styles = {};
    };

    storeStyle = (target, value) => {
        set(this.styles, target, value);
        this.changed = true;
    };

    getStyling = () => {
        let rules = [];
        forEach(this.styles, (value, rule) => {
            rules.push(rule + ': ' + value + ';');
        });

        return this.selector + ' {' + rules.join(' ') + '}';
    };

    reset = () => {
        this.generateStyling(true);
        this.changed = false;
    }

}