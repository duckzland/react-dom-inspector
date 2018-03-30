import React from 'react';
import ScrollArea from 'react-scrollbar';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
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

        const { props, state, onScroll, moveScrollBar } = this;
        const { root, config, iterator } = props;
        const { minimize, hasHorizontalScrollbar, hasVerticalScrollbar } = state;
        const { polyglot } = root;

        const panelProps = config.get('navigator.props.element', {
            key: 'stylizer-iterator-panel',
            className: [ 'stylizer-panels', 'stylizer-dom-panel', minimize ? 'minimize' : ''].join(' ')
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
            ref: (el) => { moveScrollBar(el) },
            speed: 0.8,
            className: [
                'stylizer-content',
                'stylizer-iterator',
                hasHorizontalScrollbar ? 'has-horizontal-scrollbar' : '',
                hasVerticalScrollbar > 0 ? 'has-vertical-scrollbar': ''
            ].join(' '),
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
                        const itemProps = { key: delta, root: this, node: node, config: config, mainRoot: root };
                        return ( <Items { ...itemProps } /> );
                    })}
                </ScrollArea>
            </div>
        )
    };
}