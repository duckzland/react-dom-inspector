import { forEach, set} from 'lodash';
import Parser from './Parser';
import DOMHelper from './DOMHelper';

/**
 * Class for Linking between Node and Dom inspector
 *
 * @author jason.xie@victheme.com
 */
class Store {

    config = {
        domID: 'dom-inspector',
        sheetID: 'stylizer-source',
        stylizerAttribute: 'stylizer-uuid'
    };

    constructor(node, depth, selectors, config = false) {

        config && Object.assign(this.config, config);
        
        node.matches = node.matches
            || node.webkitMatchesSelector
            || node.mozMatchesSelector
            || node.msMatchesSelector
            || node.oMatchesSelector;

        if (!node.hasAttribute(this.config.stylizerAttribute)) {
            node.setAttribute(this.config.stylizerAttribute, this.generateUUID());
        }

        this.key = selectors.join(' > ');
        this.id = node.id;
        this.className = node.className && node.className.length ? node.className.split(' ') : [];
        this.tagName = node.nodeName.toLowerCase();
        this.depth = depth;
        this.tree = selectors;
        this.unit = selectors.slice(-1)[0];
        this.uuid = node.getAttribute(this.config.stylizerAttribute);
        this.hasChildren = this.detectChildElement(node);
        this.processed = false;
        this.refresh = false;
        this.active = false;
        this.changed = false;

        this.generateSelector();
    };

    trackNode = () => {
        let node = document.querySelectorAll('[' + this.config.stylizerAttribute + '="' + this.uuid + '"]');
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

    generateStyling = () => {

        let node = this.trackNode();

        this.styles = {};
        if (!node) {
            return;
        }

        let rules = (new DOMHelper()).styleSheet({ id: this.config.sheetID }, 'content'),
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
                                forEach((directive !== 'border' ? [directive] : ['border-top', 'border-left', 'border-right', 'border-bottom']), (dir) => {
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

    storeStyling = (target, value) => {
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
        this.generateStyling();
        this.changed = false;
    }

}

export default Store;