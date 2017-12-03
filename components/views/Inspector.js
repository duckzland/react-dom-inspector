import React from 'react';
import ScrollArea from 'react-scrollbar';
import { get } from 'lodash';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import Iterator from '../modules/Iterator';
import Items from './Items';

/**
 * Class for generating the Inspector main wrapper markup
 *
 * @author jason.xie@victheme.com
 */
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
            if (nextProps.node.uuid !== this.state.active) {
                this.activateNode(nextProps.node);
            }
        }
    };

    componentDidUpdate() {
        this.refresh = false;
    };

    resetNodeStatus() {
        this.iterator.reset();
    };

    scrollToItem = (node) => {
        const DOMNode = node.trackNode();
        if (DOMNode) {
            this.state.scrolledLeft = DOMNode.offsetLeft;
            this.state.scrolledTop = DOMNode.offsetTop;
        }
    };

    moveScrollBar = (el) => {
        if (!el) {
            return false;
        }

        const { scrollXTo, scrollYTo } = el.scrollArea;
        const { scrolledLeft, scrolledTop } = this.state;
        const { leftPosition, topPosition } = el.state;

        scrolledLeft
            && (scrolledLeft !== leftPosition)
            && scrollXTo(parseInt(scrolledLeft));

        scrolledTop
            && (scrolledTop !== topPosition)
            && scrollYTo(parseInt(scrolledTop));

        return true;
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

    onScroll = (value) => {
        this.setState({
            scrolledLeft: value.leftPosition,
            scrolledTop: value.topPosition,
            hasVerticalScrollbar: value.containerHeight < value.realHeight,
            hasHorizontalScrollbar: value.containerWidth < value.realWidth
        });
    };

    render() {

        const { iterator, state, config, onScroll, moveScrollBar } = this;

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
            ref: (el) => { moveScrollBar(el) },
            speed: 0.8,
            className: [
                'stylizer-content',
                'stylizer-iterator',
                state.hasHorizontalScrollbar ? 'has-horizontal-scrollbar' : '',
                state.hasVerticalScrollbar > 0 ? 'has-vertical-scrollbar': ''
            ].join(' '),
            onScroll: onScroll,
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