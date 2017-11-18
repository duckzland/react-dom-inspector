import React from 'react';
import ScrollArea from 'react-scrollbar';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import Iterator from '../modules/Iterator';
import Items from './Items';


class Inspector extends React.Component {

    state = {
        active: false,
        minimize: false
    };

    config = {
        startingDepth: 2,
        headerText: 'Navigator'
    };

    constructor(props) {
        super(props);
        this.iterator = 'iterator' in props ? props.iterator : new Iterator();
        if ('config' in props)  {
            Object.assign(this.config, props.config);
        }
        this.iterator.iterate(document.body, false, 0, this.config.startingDepth, []);
    };

    componentWillReceiveProps(nextProps) {
        // Parent force to refresh
        if (nextProps.activateNode) {
            this.activateNode(nextProps.activateNode);
        }
    };

    componentDidUpdate() {
        this.refresh = false;
    };

    /**
     * @todo Scroll to activated item
     * @param node
     */
    activateNode = (node) => {

        const { root } = this.props;

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

        root.setActiveNode(node);
    };

    toggleMinimize = () => {
        this.setState({ minimize: !this.state.minimize });
    };

    render() {

        const { iterator, toggleMinimize, state } = this;
        let className = [
            'stylizer-panels',
            'stylizer-dom-panel'
        ];
        if (state.minimize) {
            className.push('minimize');
        }

        className = className.join(' ');

        return (
            <div key="stylizer-iterator-panel" className={ className }>
                <h3 key="stylizer-iterator-header" className="stylizer-header">
                    <span key="stylizer-iterator-header-text" className="stylizer-header-text">
                        { this.config.headerText }
                    </span>
                    <span key="stylizer-iterator-header-actions" className="stylizer-header-actions">
                        <HamburgerIcon size="16" onClick={ () => { toggleMinimize(); } } />
                    </span>
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

export default Inspector;