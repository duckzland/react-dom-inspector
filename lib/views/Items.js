import React from 'react';
import Iterator from '../modules/Iterator';
import Parser from '../modules/Parser';


class Items extends React.Component {


    shouldComponentUpdate(nextProps) {
        if (nextProps.node.refresh || nextProps.root.refresh) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        this.props.node.refresh = false;
    }

    isOverridden = (node) => {
        return 'stored' in node && node.store && node.store.length !== 0;
    };

    isActive = (node) => {
        return node.active;
    };

    isChanged = (node) => {
        return 'changes' in node && node.changes && node.changes.length !== 0;
    };

    render() {

        const { onClick, isChanged, isOverridden, isActive, state, props } = this;
        const { node, root } = props;

        let className = ['stylizer-dom-elements'];

        if (isOverridden(node)) {
            className.push('stylizer-overridden');
        }

        if (isActive(node)) {
            className.push('stylizer-active');
        }

        if (isChanged(node)) {
            className.push('stylizer-changed');
        }

        className = className.join(' ');

        return (
            <div key={ 'item-' + node.uuid } className={ className } data-depth={ node.depth } onClick={ () => { root.onClick(node) } }>
                { node.unit }
            </div>
        )
    };
}

export default Items;