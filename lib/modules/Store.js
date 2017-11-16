import { forEach } from 'lodash';
import Parser from './Parser';

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
        this.hasChildren = node.childNodes.length > 0;
        this.processed = false;
        this.refresh = false;
        this.active = false;

        this.generateSelector();
        this.generateStoredCSS(node);
        this.generateCSSObject();

    };

    trackNode = () => {
        let node = document.querySelectorAll('[stylizer-uuid="' + this.uuid + '"]');
        return node.length !== 0 ? node[0] : false ;
    };

    generateUUID = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    };

    generateStyleSheet = () => {
        let sheets = document.styleSheets;
        for (var i in sheets) {
            let styleNode = sheets[i].ownerNode;
            if (styleNode && styleNode.getAttribute('id') === 'jxdev-stylizer') {
                Store.StyleSheet = sheets[i];
                break;
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

    generateCSSObject = () => {
        this.pointer = [];
        for (var i in this.stored){
            let rules = new CSSParser(this.stored[i]);

            for (var x in rules) {
                this.pointer.push(rules[x]);
            }
        }
    };

    generateStoredCSS = (node) => {

        if (!Store.StyleSheet) {
            this.generateStyleSheet();
        }

        let ret = [];

        if (!node) {
            node = this.trackNode();
        }

        if (Store.StyleSheet && node) {
            var rules = Store.StyleSheet.rules || Store.StyleSheet.cssRules;
            for (var r in rules) {
                if (node.matches(rules[r].selectorText)) {
                    ret.push(rules[r].cssText);
                }
            }
        }

        this.stored = ret;
    };

}

export default Store;