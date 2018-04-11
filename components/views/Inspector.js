import React from 'react';
import ReactDOM from 'react-dom';
import ScrollArea from 'react-scrollbar';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import Items from './Items';
import { get } from 'lodash';

/**
 * Class for generating the Inspector main wrapper markup
 *
 * @author jason.xie@victheme.com
 */
export default class Inspector extends React.Component {

    state = {
        active: false,
        minimize: false,
        scrolledLeft: 0,
        scrolledTop: 0
    };

    refresh = false;

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
        this.props.iterator.reset();
    };

    scrollToItem = (node) => {
        const DOMNode = node.trackNode();
        DOMNode && DOMNode.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    };

    moveScrollBar = (node) => {

        const scrollBar = get(this, 'refs.stylizer-iterator-scrollbar');
        const activeItem = get(this, 'refs.stylizer-inspector-items-' + node.uuid);
        const activeItemDOM = activeItem ? ReactDOM.findDOMNode(activeItem) : false;

        if (!scrollBar || !scrollBar.scrollArea || !activeItem || !activeItemDOM) {
            return false;
        }

        const { topPosition, leftPosition, containerHeight, containerWidth } = scrollBar.state;
        const { scrollXTo, scrollYTo } = scrollBar.scrollArea;
        const { offsetTop, offsetLeft } = activeItemDOM;

        if (topPosition > offsetTop || (topPosition + (containerHeight * 0.75)) < offsetTop) {
            scrollYTo(offsetTop);
        }

        if (leftPosition > offsetLeft || (leftPosition + (containerWidth + 0.75)) < offsetLeft) {
            scrollXTo(offsetLeft);
        }

        return true;
    };

    activateNode = (node, scrollIntoView = false) => {

        const { props, state } = this;
        const { root, iterator } = props;
        const { find, iterate } = iterator;

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
        else {
            iterator.get().map((Store) => {
                Store.active = false;
            });
        }

        node.refresh = true;
        node.active = true;

        this.state.active = node.uuid;
        scrollIntoView && this.scrollToItem(node);

        // This will call setState which will refresh parent -> child state including this element.
        root.setActiveNode(node);
        this.moveScrollBar(node);
    };

    onScroll = (value) => {
        this.state.scrolledLeft = value.leftPosition;
        this.state.scrolledTop = value.topPosition;
        this.state.hasVerticalScrollbar = value.containerHeight < value.realHeight;
        this.state.hasHorizontalScrollbar = value.containerWidth < value.realWidth;
    };

    render() {

        const { props, state, onScroll } = this;
        const { root, config, iterator } = props;
        const { minimize, hasHorizontalScrollbar, hasVerticalScrollbar } = state;
        const { polyglot } = root;

        const panelProps = config.get('navigator.props.element', {
            key: 'stylizer-iterator-panel',
            className: [ 'stylizer-panels', 'stylizer-dom-panel', minimize ? 'minimize' : ''].join(' ').replace('  ', ' ')
        });

        const headerProps = config.get('navigator.props.header', {
            key: 'stylizer-iterator-header',
            className: 'stylizer-header'
        });

        const headerTextProps = config.get('navigator.props.headerText', {
            key: 'stylizer-iterator-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = config.get('navigator.props.headerAction', {
            key: 'stylizer-iterator-header-actions',
            className: 'stylizer-header-actions'
        });

        const hamburgerIconProps = config.get('navigator.props.hamburgerIcon', {
            size: 16,
            onClick: () => { this.setState({ minimize: !minimize }); }
        });

        const scrollAreaProps = config.get('navigator.props.scrollArea', {
            key: 'stylizer-iterator',
            ref: 'stylizer-iterator-scrollbar',
            speed: 0.8,
            className: [
                'stylizer-content',
                'stylizer-iterator',
                hasHorizontalScrollbar ? 'has-horizontal-scrollbar' : '',
                hasVerticalScrollbar > 0 ? 'has-vertical-scrollbar': ''
            ].join(' ').replace('  ', ' ').trim(),
            onScroll: onScroll,
            contentClassName: 'content',
            horizontal: true
        });

        return (
            <div { ...panelProps }>
                <h3 { ...headerProps }>
                    <span { ...headerTextProps }>{ polyglot.t('Navigator') }</span>
                    <span { ...headerActionProps }><span title={ polyglot.t('Minimize Navigator') }><HamburgerIcon { ...hamburgerIconProps } /></span></span>
                </h3>
                <ScrollArea { ...scrollAreaProps }>
                    { iterator.get().map((node, delta) => {
                        const itemProps = { key: delta, ref: 'stylizer-inspector-items-' + node.uuid, root: this, node: node, config: config, mainRoot: root };
                        return ( <Items { ...itemProps } /> );
                    })}
                </ScrollArea>
            </div>
        )
    };
}