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

    testerNode = false;
    config = {
        label: 'Selector',
        error: 'Invalid CSS selector'
    };

    constructor(props) {
        super(props);

        if ('node' in props && props.node) {
            this.state.node = props.node;
            this.state.selector = props.node.selector;
            this.state.badges = this.selectorToBadges();
            this.state.error = !this.validate(props.node.selector);
        }

        if ('config' in props && props.config) {
            this.config = props.config;
        }
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

        const { config, state, isActive, toggle, submit } = this;
        const tabProps = get(config, 'tabProps', {
            key: 'stylizer-tab-selector-' + state.node.uuid,
            className: 'stylizer-tab-content stylizer-content'
        });

        const selectorProps = get(config, 'selectorProps', {
            key: 'selector-form-' + state.node.uuid,
            className: ['stylizer-form-item', state.error ? 'stylizer-has-error' : ' '].join(' ')
        });

        const labelProps = get(config, 'labelProps', {
            className: 'stylizer-form-label'
        });

        const inputProps = get(config, 'inputProps', {
            key: 'input-selector-' + state.node.uuid,
            className: 'stylizer-form-input',
            type: 'text',
            name: 'selector',
            value: state.selector,
            onChange: submit
        });

        const errorProps = get(config, 'errorProps', {
            key: 'input-selector-error-' + state.node.uuid,
            className: 'stylizer-error-bag'
        });

        const badgesProps = get(config, 'badgesProps', {
            key: 'selector-badges-' + state.node.uuid,
            className: 'stylizer-selector-badges'
        });

        const badgeItemProps = get(config, 'badgeItemProps', {
            className: 'stylizer-selector-badges-text'
        });

        const badgeIconProps = get(config, 'badgeIconPorps', {
            className: 'stylizer-selector-badges-separator'
        });

        return (
            <div { ...tabProps }>
                <div { ...selectorProps }>
                    <label { ...labelProps }>{ config.label }</label>
                    <input { ...inputProps } />
                    { state.error && config.error && <div { ...errorProps }>{ config.error }</div> }
                </div>
                <div { ...badgesProps }>
                    { state.node && state.node.tree && state.node.tree.map((item, delta) => {
                        const badgeProps = get(config, 'badgeProps', {
                            key: 'badges-' + delta,
                            onClick: () => { toggle(item) },
                            className: ['stylizer-selector-badge', isActive(item) ? 'active' : ' '].join(' ')
                        });

                        return (
                            <span { ...badgeProps }>
                                <span { ...badgeItemProps }>{ item }</span>
                                { state.node
                                    && state.node.tree
                                    && state.node.tree[delta + 1]
                                    && <ArrowIcon { ...badgeIconProps } /> }
                            </span>
                        )
                    }) }
                </div>
            </div>
        )
    };
}