import Store from './Store';
import { findIndex, find } from 'lodash';

class Iterator {

    storage = [];
    crawled = [];

    iterate = (node, parent, depth, maxDepth, selectors) => {

        this.crawled = [];
        this.doCrawling(node, parent, depth, maxDepth, selectors);
        let ParentIndex = parent ? findIndex(this.storage, { uuid: parent.uuid }) : this.storage.length;
        Array.prototype.splice.apply(this.storage, [ParentIndex, 1].concat(this.crawled));
        this.crawled = [];

    };

    doCrawling = (node, parent, depth, maxDepth, selectors) => {

        if (depth === maxDepth || node.nodeType !== node.ELEMENT_NODE || node.id === 'dom-inspector') {
            return;
        }

        selectors = selectors.slice(0, depth);
        this.selector(node, selectors);

        let Storage = new Store(node, depth, selectors);
        this.crawled.push(Storage);
        if (parent) {
            parent.processed = true;
        }
        for (let x=0; x < node.childNodes.length; x++) {
            let childNode = node.childNodes[x];
            if ( childNode.childNodes.length > 0) {
                this.doCrawling(childNode, Storage, depth + 1, maxDepth, selectors);
            }
        }

    };

    selector(node, selectors) {
        let selector = [];

        'nodeName' in node
            && node.nodeName.length
            && selector.push(node.nodeName.toLowerCase());

        'id' in node
            && node.id.length
            && selector.push('#' + node.id);

        'className' in node
            && node.className.length
            && selector.push('.' + node.className.replace(/\s+/g,"."));

        selectors.push(selector.join(''));
    };

    getStorage = () => {
        return this.storage;
    };

    findNode = (uuid) => {
        return find(this.storage, { uuid: uuid});
    };

    destroy = () => {
        this.storage.forEach((Store, delta) => {
            let node = Store.trackNode();
            node && node.removeAttribute && node.removeAttribute('stylizer-uuid');
            Store = null;
            delete this.storage[delta];
        });
    };
}

export default Iterator;