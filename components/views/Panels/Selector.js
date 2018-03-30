import React from 'react';
import ArrowIcon from '../../../node_modules/react-icons/lib/io/chevron-right';
import { get } from 'lodash';

/**
 * Component for building the stylizer selector form item markup
 *
 * @author jason.xie@victheme.com
 */
export default class Selector extends React.Component {

    state = {
        node: false,
        selector: '',
        badges: [],
        error: false
    };

    polyglot = false;
    testerNode = false;

    constructor(props) {
        super(props);

        if ('node' in props && props.node) {
            this.state.node = props.node;
            this.state.selector = props.node.selector;
            this.state.badges = this.selectorToBadges();
            this.state.error = !this.validate(props.node.selector);
        }

        this.polyglot = props.mainRoot.polyglot;
    };

    componentWillReceiveProps(nextProps) {
        if ('node' in nextProps && nextProps.node) {
            this.setState({
                node: nextProps.node,
                selector: nextProps.node.selector,
                error: !this.validate(nextProps.node.selector),
                badges: this.selectorToBadges()
            })
        }
    };

    selectorToBadges = () => {
        const { state } = this;
        const { node }  = state;

        state.badges = [];
        node.tree && node.tree.map((item) => {
            if (state.selector.trim().indexOf(item.trim()) !== -1) {
                state.badges.push(item.trim());
            }
        });
        return state.badges;
    };

    badgesToSelector = () => {
        const { badges, node } = this.state;
        let Badges = [];
        node.tree && node.tree.map((selector, delta) => {
            if (badges.indexOf(selector) !== -1) {
                Badges.push(selector);
            }
        });
        return Badges.join(' > ').trim();
    };

    toggle = (selector) => {

        const { state } = this;
        const { badges } = state;

        let Index = badges.indexOf(selector);
        if (Index === -1) {
            badges.push(selector);
        }
        else {
            badges.splice(Index, 1);
        }

        let refresh = {
            selector: this.badgesToSelector(),
            badges: badges
        };

        refresh.error = !this.validate(refresh.selector);

        if (!refresh.error) {
            this.props.root.rebuildStyling({
                target: {
                    name: 'selector',
                    value: refresh.selector
                }
            });
        }

        this.setState(refresh);
    };

    isActive = (selector) => {
        return this.state.badges.indexOf(selector) !== -1;
    };

    validate = (selector) => {
        let validate = false;
        try {
            validate = this.state.node.validateSelector(selector);
        }
        catch (error) {
            validate = false;
        }
        return validate;
    };

    submit = (e) => {
        const { value } = e.target;
        let refresh = {
            selector: value,
            error: !this.validate(value),
            badges: this.selectorToBadges()
        };

        if (!refresh.error) {
            this.props.root.rebuildStyling(e);
        }

        this.setState(refresh);
    };

    render() {

        const { props, state, isActive, toggle, submit, polyglot } = this;
        const { config } = props;
        const { node, error } = state;

        const tabProps = config.get('panels.selector.props.tab', {
            key: 'stylizer-tab-selector-' + node.uuid,
            className: 'stylizer-tab-content stylizer-content stylizer-tab-panel--selector'
        });

        const selectorProps = config.get('panels.selector.props.selector', {
            key: 'selector-form-' + node.uuid,
            className: ['stylizer-form-item', state.error ? 'stylizer-has-error' : ' '].join(' ')
        });

        const labelProps = config.get('panels.selector.props.label', {
            className: 'stylizer-form-label'
        });

        const inputProps = config.get('panels.selector.props.input', {
            key: 'input-selector-' + node.uuid,
            className: 'stylizer-form-input',
            type: 'text',
            name: 'selector',
            value: state.selector,
            onChange: submit
        });

        const errorProps = config.get('panels.selector.props.error', {
            key: 'input-selector-error-' + node.uuid,
            className: 'stylizer-error-bag'
        });

        const badgesProps = config.get('panels.selector.props.badges', {
            key: 'selector-badges-' + node.uuid,
            className: 'stylizer-selector-badges'
        });

        const badgeItemProps = config.get('panels.selector.props.badgeItem', {
            className: 'stylizer-selector-badges-text'
        });

        const badgeIconProps = config.get('panels.selector.props.badgeIcon', {
            className: 'stylizer-selector-badges-separator'
        });

        return (
            <div { ...tabProps }>
                <div { ...selectorProps }>
                    <label { ...labelProps }>{ polyglot.t('Selector') }</label>
                    <input { ...inputProps } />
                    { error && config.get('panels.selector.error', true) && <div { ...errorProps }>{ polyglot.t('Invalid CSS selector') }</div> }
                </div>
                <div { ...badgesProps }>
                    { node && node.tree && node.tree.map((item, delta) => {
                        const badgeProps = config.get('panels.selector.props.badge', {
                            key: 'badges-' + delta,
                            onClick: () => { toggle(item) },
                            className: ['stylizer-selector-badge', isActive(item) ? 'active' : ' '].join(' ')
                        });

                        return (
                            <span { ...badgeProps }>
                                <span { ...badgeItemProps }>{ item }</span>
                                { node
                                    && node.tree
                                    && node.tree[delta + 1]
                                    && <ArrowIcon { ...badgeIconProps } /> }
                            </span>
                        )
                    }) }
                </div>
            </div>
        )
    };
}