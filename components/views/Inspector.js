import React from 'react';
import ScrollArea from 'react-scrollbar';
import { get } from 'lodash';
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
        if ('refresh' in nextProps && nextProps.refresh) {
            this.resetNodeStatus();
        }
        if ('node' in nextProps && nextProps.node) {
            this.activateNode(nextProps.node);
        }
    };

    componentDidUpdate() {
        this.refresh = false;
    };

    resetNodeStatus() {
        this.getStorage().map((node) => {
            node.reset();
        });
    };

    /**
     * @todo Scroll to activated item
     * @param node
     */
    activateNode = (node) => {

        const { props, iterator, state } = this;
        const { findNode, iterate } = iterator;
        const { root } = props;

        if (node.hasChildren && !node.processed) {

            iterate(node.trackNode(), node, node.depth, node.depth + 2, node.tree);
            this.refresh = true;

            let currentNode = findNode(node.uuid);
            if (currentNode && currentNode.uuid) {
                node = currentNode;
            }
        }

        let prevActive = findNode(state.active);
        if (prevActive && prevActive.uuid) {
            prevActive.refresh = true;
            prevActive.active = false;
        }

        node.refresh = true;
        node.active = true;

        this.setState({ active : node.uuid });
        root.setActiveNode(node);
    };

    render() {

        const { iterator, toggleMinimize, state, config } = this;

        const panelProps = get(config, 'panelProps', {
            key: 'stylizer-iterator-panel',
            className: [ 'stylizer-panels', 'stylizer-dom-panel', state.minimize ? 'minimize' : ''].join(' ')
        });

        const headerProps = get(config, 'headerProps', {
            key: 'stylizer-iterator-header',
            className: 'stylizer-header'
        });

        const headerTextProps = get(config, 'headerTextProps', {
            key: 'stylizer-iterator-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = get(config, 'headerActionProps', {
            key: 'stylizer-iterator-header-actions',
            className: 'stylizer-header-actions'
        });

        const hamburgerIconProps = get(config, 'hamburgerIconProps', {
            size: 16,
            onClick: () => { this.setState({ minimize: !this.state.minimize }); }
        });

        const scrollAreaProps = get(config, 'scrollAreaProps', {
            key: 'stylizer-iterator',
            speed: 0.8,
            className: 'stylizer-content stylizer-iterator',
            contentClassName: 'content',
            horizontal: true
        });

        return (
            <div { ...panelProps }>
                <h3 { ...headerProps }>
                    <span { ...headerTextProps }>{ config.headerText }</span>
                    <span { ...headerActionProps }><HamburgerIcon { ...hamburgerIconProps } /></span>
                </h3>
                <ScrollArea { ...scrollAreaProps }>
                    { iterator.getStorage().map((node, delta) => {
                        const itemProps = { key: delta, root: this, node: node };
                        return ( <Items { ...itemProps } /> );
                    })}
                </ScrollArea>
            </div>
        )
    };
}

export default Inspector;