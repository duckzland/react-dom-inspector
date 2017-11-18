import { forEach, set} from 'lodash';
import Parser from './Parser';
import DOMHelper from './DOMHelper';

class Store {

    static StyleSheet = null;

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

    detectChildElement(node) {
        var child, rv = false;

        for (child = node.firstChild; !rv && child; child = child.nextSibling) {
            if (child.nodeType === node.ELEMENT_NODE && child.nodeName.toLowerCase() !== 'img') {
                rv = true;
            }
        }

        return rv;
    }

    generateUUID = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    };

    generateStyling = () => {

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
                                    value = parsed[x].rules[y].value,
                                    parts = false,
                                    values = false,
                                    direction = false,
                                    elements = document.createElement('span');

                                switch (directive) {
                                    case 'border-radius' :
                                    case 'padding' :
                                    case 'margin' :
                                        parts = value.replace(/ +(?= )/g,'').split(' ');
                                        values = {
                                            top: parts[0],
                                            right: parts[1] ? parts[1] : parts[0],
                                            bottom: parts[2] ? parts[2] : parts[0],
                                            left: parts[4] ? parts[4] : parts[1] ? parts[1] : parts[0]
                                        };

                                        ['top', 'left', 'right', 'bottom'].map((dir) => {
                                            set(this.styles, directive + '-' + dir, values[dir]);
                                        });
                                        break;

                                    case 'border-left' :
                                    case 'border-right' :
                                    case 'border-top' :
                                    case 'border-bottom' :
                                    case 'border' :
                                        parts = value.replace(/ +(?= )/g,'').split(' ');
                                        values = {
                                            size: parts[0] ? parts[0] : '',
                                            style: parts[1] ? parts[1] : '',
                                            color: parts[2] ? parts[2] : ''
                                        };
                                        direction = [directive];
                                        if (directive === 'border') {
                                            direction = ['border-top', 'border-left', 'border-right', 'border-bottom'];
                                        }

                                        direction.map((dir) => {
                                            ['size', 'style', 'color'].map((type) => {
                                                set(this.styles, dir + '-' + type, values[type]);
                                            });
                                        });

                                        break;
                                    case 'font' :
                                        elements.removeAttribute('style');
                                        elements.setAttribute('style', 'font: ' + value);
                                        set(this.styles, 'font-style', elements.style['fontStyle']);
                                        set(this.styles, 'font-variant', elements.style['fontVariant']);
                                        set(this.styles, 'font-weight', elements.style['fontWeight']);
                                        set(this.styles, 'font-stretch', elements.style['fontStretch']);
                                        set(this.styles, 'font-size', elements.style['fontSize']);
                                        set(this.styles, 'font-family', elements.style['fontFamily']);
                                        set(this.styles, 'line-height', elements.style['lineHeight']);
                                        break;
                                    case 'background' :
                                        elements.removeAttribute('style');
                                        elements.setAttribute('style', 'background: ' + value);
                                        set(this.styles, 'background-color', elements.style['backgroundColor']);
                                        set(this.styles, 'background-image', elements.style['backgroundImage']);
                                        set(this.styles, 'background-position', elements.style['backgroundPosition']);
                                        set(this.styles, 'background-repeat', elements.style['backgroundRepeat']);
                                        set(this.styles, 'background-attachment', elements.style['backgroundAttachment']);
                                        set(this.styles, 'background-size', elements.style['backgroundSize']);
                                        set(this.styles, 'background-clip', elements.style['backgroundClip']);
                                        set(this.styles, 'background-origin', elements.style['backgroundOrigin']);
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

    storeStyling = (target, value) => {
        set(this, target, value);
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