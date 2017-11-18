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
        const { node }  = this.state;

        this.state.activeBadges = [];
        node.tree && node.tree.map((item, delta) => {
            if (item.indexOf(node.selector) !== -1) {
                this.state.activeBadges.push(item);
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
        let Index = this.state.activeBadges.indexOf(selector);
        if (Index === -1) {
            this.state.activeBadges.push(selector);
        }
        else {
            this.state.activeBadges.splice(Index, 1);
        }
        this.buildBadgeSelector();
        this.setState({
            activeBadges: this.state.activeBadges
        });
    };

    isBadgeActive = (selector) => {
        return this.state.activeBadges.indexOf(selector) !== -1;
    };

    render() {

        const { props, state, isBadgeActive, toggleBadge } = this;
        const { node } = state;
        const { root } = props;

        return (
            <div key="stylizer-tab-selector" className="stylizer-tab-content stylizer-content">
                <div className="stylizer-form-item">
                    <label>Selector</label>
                    <input key={ 'input-selector-' + node.uuid + '-' + node.selector } type="text" defaultValue={ node.selector } name="selector" onChange={ (e) => root.rebuildStyling(e) } />
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