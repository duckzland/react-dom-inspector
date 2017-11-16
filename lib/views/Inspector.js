import React from 'react';
import Iterator from '../modules/Iterator';
import Items from './Items';


class Inspector extends React.Component {

    state = {
        active: false
    };

    constructor(props) {
        super(props);
        this.iterator = new Iterator();
        this.iterator.iterate(document.body, false, 0, 2, []);
    };

    componentDidUpdate() {
        this.refresh = false;
    }

    onClick = (node) => {

        if (node.hasChildren && !node.processed) {

            this.iterator.iterate(node.trackNode(), node, node.depth, node.depth + 2, node.tree);
            this.refresh = true;

            let currentNode = this.iterator.findNode(node.uuid);
            if (currentNode && currentNode.uuid) {
                node = currentNode;
            }
        }

        let prevActive = this.iterator.findNode(this.state.active);
        if (prevActive && prevActive.uuid) {
            prevActive.refresh = true;
            prevActive.active = false;
        }

        node.refresh = true;
        node.active = true;

        this.setState({ active : node.uuid });
    };

    render() {

        const { iterator } = this;
        return (
            <div key="document-iterator" className="stylizer-dom-wrapper">
                { iterator.getStorage().map((node, delta) => {
                    return ( <Items key={ delta } root={ this } node={ node } /> );
                })}
            </div>
        )
    };
}

export default Inspector;