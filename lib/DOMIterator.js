
import ObjectStore from './ObjectStore';

class DOMIterator {

    constructor() {
        this.dom = document.body;
        this.parsed = [];
        this.iterate(this.dom, 0, []);
    }

    iterate(node, depth, selectors) {

        selectors = selectors.slice(0, depth);
        this.selector(node, selectors);
        this.parsed.push(new ObjectStore(node, depth, selectors));

        for (let x=0; x < node.childNodes.length; x++) {
            let childNode = node.childNodes[x];
            if ( childNode.childNodes.length > 0) {
                this.iterate(childNode, depth + 1, selectors);
            }
        }
    }

    selector(node, selectors) {
        let selector = [];

        'nodeName' in node && selector.push(node.nodeName.toLowerCase());
        'id' in node && selector.push('#' + node.id);
        'className' in node && selector.push('.' + node.className.replace(/\s+/g,"."));

        selectors.push(selector.join(''));
    }
}

export default DOMIterator;