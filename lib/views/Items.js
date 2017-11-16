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

    isParent = (node) => {
        return node.hasChildren;
    };

    isProcessed = (node) => {
        return node.processed;
    };

    render() {

        const { isParent, isProcessed, isChanged, isOverridden, isActive, props } = this;
        const { node, root } = props;

        let className = ['stylizer-element'];

        if (isOverridden(node)) {
            className.push('overridden');
        }

        if (isActive(node)) {
            className.push('active');
        }

        if (isChanged(node)) {
            className.push('changed');
        }

        if (isParent(node)) {
            className.push('parents');
        }

        if (isProcessed(node)) {
            className.push('processed');
        }

        className = className.join(' ');

        return (
            <div key={ 'item-' + node.uuid } className={ className } data-depth={ node.depth } onClick={ () => { root.activateNode(node) } }>
                { node.unit }
            </div>
        )
    };
}

export default Items;