class ObjectStore {
    constructor(node, depth, selectors) {

        // Simple polyfills for node matches
        node.matches = node.matches
        || node.webkitMatchesSelector
        || node.mozMatchesSelector
        || node.msMatchesSelector
        || node.oMatchesSelector;

        this.data = {
            id: node.id,
            className: node.className.split(' '),
            tagName: node.nodeName.toLowerCase(),
            depth: depth,
            selectors: selectors,
            key: selectors.slice(-1)[0],
            node: node
        };

        this.matches = node.matches;
    }

    getCss = () => {
        let sheets = document.styleSheets,
            sheet = false,
            ret = [];

        for (var i in sheets) {
            let styleNode = sheets[i].ownerNode;
            if (styleNode && styleNode.getAttribute('id') === 'jxdev-stylizer') {
                sheet = sheets[i];
                break;
            }
        }

        if (sheet) {
            var rules = sheet.rules || sheet.cssRules;
            for (var r in rules) {
                if (this.matches(rules[r].selectorText)) {
                    ret.push(rules[r].cssText);
                }
            }
        }

        return ret;
    }

}

export default ObjectStore;