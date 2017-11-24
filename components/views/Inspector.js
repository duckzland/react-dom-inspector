import React from 'react';
import ScrollArea from 'react-scrollbar';
import { get } from 'lodash';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import Iterator from '../modules/Iterator';
import Items from './Items';

export default class Inspector extends React.Component {

    state = {
        active: false,
        minimize: false
    };

    config = {
        InspectorPanelStartingDepth: 2,
        InspectorPanelHeaderText: 'Navigator'
    };

    constructor(props) {
        super(props);
        this.iterator = 'iterator' in props ? props.iterator : new Iterator();
        if ('config' in props)  {
            Object.assign(this.config, props.config);
        }
        this.iterator.iterate(document.body, false, 0, this.config.InspectorPanelStartingDepth, []);
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
        this.iterator.get().map((node) => {
            node.reset();
        });
    };

    scrollToItem = (node) => {

    };

    activateNode = (node) => {

        const { props, iterator, state } = this;
        const { find, iterate } = iterator;
        const { root } = props;

        if (node.hasChildren && !node.processed) {
            iterate(node.trackNode(), node, node.depth, node.depth + 2, node.tree);
            this.refresh = true;

            let currentNode = find(node.uuid);
            if (currentNode && currentNode.uuid) {
                node = currentNode;
            }
        }

        let prevActive = find(state.active);
        if (prevActive && prevActive.uuid) {
            prevActive.refresh = true;
            prevActive.active = false;
        }

        node.refresh = true;
        node.active = true;

        root.setActiveNode(node);
        this.scrollToItem(node);
        this.setState({ active : node.uuid });
    };

    render() {

        const { iterator, state, config } = this;

        const panelProps = get(config, 'inspectorPanelProps', {
            key: 'stylizer-iterator-panel',
            className: [ 'stylizer-panels', 'stylizer-dom-panel', state.minimize ? 'minimize' : ''].join(' ')
        });

        const headerProps = get(config, 'inspectorPanelHeaderProps', {
            key: 'stylizer-iterator-header',
            className: 'stylizer-header'
        });

        const headerTextProps = get(config, 'inspectorPanelHeaderTextProps', {
            key: 'stylizer-iterator-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = get(config, 'inspectorPanelHeaderActionProps', {
            key: 'stylizer-iterator-header-actions',
            className: 'stylizer-header-actions'
        });

        const hamburgerIconProps = get(config, 'inspectorPanelHamburgerIconProps', {
            size: 16,
            onClick: () => { this.setState({ minimize: !this.state.minimize }); }
        });

        const scrollAreaProps = get(config, 'inspectorPanelScrollAreaProps', {
            key: 'stylizer-iterator',
            speed: 0.8,
            className: 'stylizer-content stylizer-iterator',
            contentClassName: 'content',
            horizontal: true
        });

        return (
            <div { ...panelProps }>
                <h3 { ...headerProps }>
                    <span { ...headerTextProps }>{ config.InspectorPanelHeaderText }</span>
                    <span { ...headerActionProps }><HamburgerIcon { ...hamburgerIconProps } /></span>
                </h3>
                <ScrollArea { ...scrollAreaProps }>
                    { iterator.get().map((node, delta) => {
                        const itemProps = { key: delta, root: this, node: node };
                        return ( <Items { ...itemProps } /> );
                    })}
                </ScrollArea>
            </div>
        )
    };
}