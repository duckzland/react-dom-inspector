import React from 'react';
import ArrowIcon from '../../../node_modules/react-icons/lib/io/chevron-right';

class Selector extends React.Component {

    state = {
        node: false,
        activeBadges: []
    };

    constructor(props) {
        super(props);
        this.state.node = 'node' in props ?  props.node : false;
        this.trackBadgeSelector();
    };

    componentWillReceiveProps(nextProps) {
        this.state.node = nextProps.node;
        this.trackBadgeSelector();
    };

    trackBadgeSelector = () => {
        const { state } = this;
        const { node }  = state;

        state.activeBadges = [];
        node.tree && node.tree.map((item) => {
            if (item.indexOf(node.selector) !== -1) {
                state.activeBadges.push(item);
            }
        });
    };
    
    buildBadgeSelector = () => {
        const { activeBadges, node } = this.state;
        let Badges = [];
        node.tree && node.tree.map((selector, delta) => {
            if (activeBadges.indexOf(selector) !== -1) {
                Badges.push(selector);
            }
        });
        node.selector = Badges.join(' > ');
    };

    toggleBadge = (selector) => {

        const { state } = this;
        const { activeBadges } = state;

        let Index = activeBadges.indexOf(selector);
        if (Index === -1) {
            activeBadges.push(selector);
        }
        else {
            activeBadges.splice(Index, 1);
        }
        this.buildBadgeSelector();
        this.setState({
            activeBadges: activeBadges
        });
    };

    isBadgeActive = (selector) => {
        return this.state.activeBadges.indexOf(selector) !== -1;
    };

    render() {

        const { props, state, isBadgeActive, toggleBadge } = this;
        const { node } = state;
        const { root } = props;

        let className = ['stylizer-form-item'];
        if (root.hasError('selector')) {
            className.push('stylizer-has-error');
        }

        return (
            <div key="stylizer-tab-selector" className="stylizer-tab-content stylizer-content">
                <div key={ 'selector-' + className.join('-') } className={ className.join(' ') }>
                    <label className="stylizer-form-label">Selector</label>
                    <input type="text"
                           name="selector"
                           className="stylizer-form-input"
                           key={ 'input-selector-' + node.uuid + '-' + node.selector }
                           defaultValue={ node.selector }
                           onBlur={ (e) => root.rebuildStyling(e) } />
                    {
                        root.hasError('selector')
                        && <div key={ 'input-selector-error-' + node.uuid + '-' + node.selector }
                                className="stylizer-error-bag">
                                    Invalid CSS Selector
                            </div>
                    }
                </div>
                <div className="stylizer-selector-badges">
                    {
                        node && node.tree && node.tree.map((item, delta) => {
                         
                            let className = ['stylizer-selector-badge'];
                            if (isBadgeActive(item)) {
                                className.push('active');
                            }

                            return (
                                <span key={ 'badges-' + delta } className={ className.join(' ') } onClick={ () => { toggleBadge(item) } }>
                                    <span className="stylizer-selector-badges-text">{ item }</span>
                                    { node.tree[delta + 1] && <ArrowIcon className="stylizer-selector-badges-separator" /> }
                                </span>
                            )
                        })
                    }
                </div>
            </div>
        )
    };
}

export default Selector;