import { forEach, get, add, set, isNumber, pickBy} from 'lodash';
import Parser from './Parser';

class DOMHelper {

    constructor() {
        return this;
    };

    closest = (node, rules, output = 'node') => {
        let tracker = node,
            result = false,
            depth = 0;

        while (tracker) {
            if (this.checkNode(tracker, rules)) {
                result = tracker;
                break;
            }

            tracker = tracker.parentElement;
            depth++;
        }

        tracker = null;

        switch (output) {
            case 'boolean' :
                return result !== false;
            case 'count' :
                return depth;
            case 'both' :
                return {
                    node: result,
                    depth: depth
                };
            default:
                return result;
        }
    };

    checkNode = (node, rules) => {

        let result = false;

        if (!node) {
            return false;
        }

        forEach(rules, (value, rule) => {
            switch (rule) {
                case 'id' :
                    if ('id' in node && node.id === value) {
                        result = node;
                    }
                    break;

                case 'className' :
                    if ('className' in node && node.className.match) {
                        let regex= new RegExp(value),
                            string = node.className.match(regex);
                        if (string && string.index) {
                            result = node;
                        }
                    }
                    break;

                case 'hasAttribute' :
                    if ('hasAttribute' in node && node.hasAttribute(value)) {
                        result = node;
                    }
                    break;

                case 'hasAttributeValue' :
                    if ('getAttribute' in node && node.getAttribute(value.attribute) === value.value) {
                        result = node;
                    }
                    break;
            }

            if (result !== false) {
                return false;
            }
        });

        return result;
    };

    styleSheet = (rules, output = 'node') => {
        let sheets = document.styleSheets;

        if (output !== 'all') {
            for (var i in sheets) {
                let styleNode = sheets[i].ownerNode;
                if (this.checkNode(styleNode, rules)) {
                    switch (output) {
                        case 'style' :
                            return sheets[i];
                            break;
                        case 'node' :
                            return sheets[i].ownerNode;
                        case 'content' :
                            return sheets[i].rules || sheets[i].cssRules;
                        case 'both' :
                            return {
                                node: sheets[i],
                                content: sheets[i].rules || sheets[i].cssRules
                            }

                    }
                }
            }
        }
        else {
            return sheets
        }

        return false;
    }

}

export default DOMHelper;