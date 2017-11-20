import React from 'react';
import { get } from 'lodash';

/**
 * Class for building the Inspector single items
 *
 * @author jason.xie@victheme.com
 */
class Items extends React.Component {

    constructor(props) {
        super(props);
        this.config = get(props, 'config', {});
    };

    shouldComponentUpdate(nextProps) {
        return !(nextProps.node.refresh || nextProps.root.refresh) ? false : true;
    }

    componentDidUpdate() {
        this.props.node.refresh = false;
    }

    isLoaded = (node) => {
        return 'styles' in node && node.styles && node.styles.length !== 0;
    };

    isActive = (node) => {
        return node.active;
    };

    isChanged = (node) => {
        return node.changed;
    };

    isParent = (node) => {
        return node.hasChildren;
    };

    isProcessed = (node) => {
        return node.processed;
    };

    render() {

        const { isParent, isProcessed, isChanged, isLoaded, isActive, props, config } = this;
        const { node, root } = props;
        const itemProps = get(config, 'itemProps', {
            key: 'item-' + node.uuid,
            className: [
                'stylizer-element',
                isLoaded(node) ? 'loaded' : '',
                isActive(node) ? 'active' : '',
                isChanged(node) ? 'changed' : '',
                isParent(node) ? 'parents' : '',
                isProcessed(node) ? 'processed' : ''
            ].join(' '),
            'data-depth' : node.depth,
            onClick: () => { root.activateNode(node) }
        });

        return (
            <div { ...itemProps }>{ node.unit }</div>
        )
    };
}

export default Items;