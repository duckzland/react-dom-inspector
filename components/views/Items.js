import React from 'react';
import Configurator from '../modules/Config';
import { get } from 'lodash';

/**
 * Class for building the Inspector single items
 *
 * @author jason.xie@victheme.com
 */
export default class Items extends React.Component {

    config = false;

    constructor(props) {
        super(props);
        this.config = new Configurator();
        if ('config' in props)  {
            this.config.insert(props.config);
        }
    };

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
        const { isParent, isProcessed, isChanged, isLoaded, isActive, props, config } = this;
        const { node, root } = props;
        const itemProps = config.get('InspectorItemsItemProps', {
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