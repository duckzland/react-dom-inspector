import React from 'react';
import ScrollArea from 'react-scrollbar';
import Iterator from '../modules/Iterator';
import Items from './Items';


class InspectorPanel extends React.Component {

    state = {
        active: false
    };

    config = {
        startingDepth: 2,
        headerText: 'Stylizer'
    };

    constructor(props) {
        super(props);
        this.iterator = new Iterator();
        if ('config' in props)  {
            Object.assign(this.config, props.config);
        }
        this.iterator.iterate(document.body, false, 0, this.config.startingDepth, []);
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
            <div key="stylizer-iterator-panel" className="stylizer-panels stylizer-dom-panel">
                <h3 key="stylizer-iterator-header" className="stylizer-header">
                    { this.config.headerText }
                </h3>
                <ScrollArea
                    key="stylizer-iterator"
                    speed={0.8}
                    className="stylizer-content stylizer-iterator"
                    contentClassName="content"
                    horizontal={ true }>
                    { iterator.getStorage().map((node, delta) => {
                        return ( <Items key={ delta } root={ this } node={ node } /> );
                    })}
                </ScrollArea>
            </div>
        )
    };
}

export default InspectorPanel;