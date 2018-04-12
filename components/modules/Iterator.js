import Store from './Store';
import { findIndex, find, forEach } from 'lodash';

/**
 * Class for helping to iterate and build the Store object
 * through DOMObject. This supports partial hierarchical iteration
 * via maximum depth settings for iterating children at any given
 * point at DOM tree.
 *
 * @author jason.xie@victheme.com
 */
export default class Iterator {

    storage = [];
    crawled = [];
    config = {
        domID: 'dom-inspector',
        sheetID: 'stylizer-source',
        stylizerAttribute: 'stylizer-uuid',
        disallowNodeName: 'img|script|style|link'
    };

    constructor(config) {
        config && Object.assign(this.config, config);
    }

    iterate = (node, parent, depth, maxDepth, tree) => {

        if ('crawled' in node && node.crawled) {
            return;
        }
        
        this.crawled = [];

        this.crawl(node, parent, depth, maxDepth, tree);
        let ParentIndex = parent ? findIndex(this.storage, { uuid: parent.uuid }) : this.storage.length;
        Array.prototype.splice.apply(this.storage, [ParentIndex, 1].concat(this.crawled));

        node.crawled = true;
        this.crawled = [];

    };

    crawl = (node, parent, depth, maxDepth, tree) => {

        let nodeName = node.nodeName.toLowerCase(),
            currentNode = [];

        if (depth === maxDepth
            || node.nodeType !== node.ELEMENT_NODE
            || node.id === this.config.domID
            || nodeName.match(new RegExp('(' + this.config.disallowNodeName + ')', 'g'))) {
            return;
        }

        // Generate the right tree structure
        tree = tree.slice(0, depth);
        'nodeName' in node
            && node.nodeName.length
            && currentNode.push(node.nodeName.toLowerCase());

        'id' in node
            && node.id.length
            && currentNode.push('#' + node.id);

        'className' in node
            && node.className.length
            && forEach(node.className.trim().split(' ').filter(n => true), (className) => {
                className.length
                    && className.indexOf('.') === -1
                    && currentNode.push('.' + className);
            });

        tree.push(currentNode.join(''));

        let nodeParent = parent;
        if (nodeParent.depth !== (depth - 1)) {
            if (parent.parent && parent.parent.depth === depth - 1) {
                nodeParent = parent.parent;
            }
        }

        const Storage = new Store(node, depth, tree, this.config, nodeParent);
        this.crawled.push(Storage);

        if (parent) {
            parent.processed = true;
        }

        for (let x=0; x < node.childNodes.length; x++) {
            this.crawl(node.childNodes[x], Storage, depth + 1, maxDepth, tree);
        }

    };

    get = () => {
        return this.storage;
    };

    find = (uuid) => {
        return find(this.storage, { uuid: uuid});
    };
    
    reset = () => {
        this.storage.map((Store, delta) => {
            Store.reset();
        });
    };

    destroy = () => {
        this.storage.forEach((Store, delta) => {
            let node = Store.trackNode();
            node.crawled = false;
            node && node.removeAttribute && node.removeAttribute(this.config.stylizerAttribute);
            Store = null;
            delete this.storage[delta];
        });
    };
}