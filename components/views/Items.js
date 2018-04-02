import React from 'react';

/**
 * Class for building the Inspector single items
 *
 * @author jason.xie@victheme.com
 */
export default class Items extends React.Component {

    isLoaded(node) {
        return 'styles' in node && node.styles && node.styles.length !== 0;
    }

    isActive(node) {
        return node.active;
    };

    isChanged(node) {
        return node.changed;
    };

    isParent(node) {
        return node.hasChildren;
    };

    isProcessed(node) {
        return node.processed;
    };

    render() {
        const { isParent, isProcessed, isChanged, isLoaded, isActive, props } = this;
        const { node, root, config } = props;
        const itemProps = config.get('navigator.props.items', {
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
            onClick: () => { root.activateNode(node, true) }
        });

        return (
            <div { ...itemProps }>{ node.unit }</div>
        )
    };
}