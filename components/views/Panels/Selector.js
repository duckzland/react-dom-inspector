import React from 'react';
import ArrowIcon from '../../../node_modules/react-icons/lib/io/chevron-right';

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

    constructor(props) {
        super(props);

        if ('node' in props && props.node) {
            this.state.node = props.node;
            this.state.selector = props.node.selector;
            this.state.badges = this.selectorToBadges();
            this.state.error = !this.validate(props.node.selector);
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
        const Tree = node.tree ? node.tree : [];
        const Selectors = node.selector.trim().replace('>', '').replace('  ', ' ').split(' ');

        state.badges = [];
        Tree.map((item) => {
            Selectors.map((selector) => {
                if (item.trim().indexOf(selector) !== -1) {
                    state.badges.push(item.trim());
                }
            });
        });
        return state.badges;
    };

    badgesToSelector = () => {
        const { badges, node } = this.state;
        const Tree = node.tree ? node.tree : [];
        let Badges = [], Selector = '';

        Tree.map((selector) => {
            if (badges.indexOf(selector) !== -1) {
                Badges.push(selector);
            }
        });

        Badges.map((badge, delta) => {

            const selfIndex = Tree.indexOf(badge);
            const nextIndex = Tree.indexOf(Badges[delta + 1]);

            Selector += badge;
            if (nextIndex === selfIndex + 1) {
                Selector += ' >';
            }

            if (nextIndex) {
                Selector += ' ';
            }
        });

        return Selector.trim();
    };

    toggle = (selector) => {

        const { state, props, badgesToSelector, validate } = this;
        const { badges } = state;

        const Index = badges.indexOf(selector);
        if (Index === -1) {
            badges.push(selector);
        }
        else {
            badges.splice(Index, 1);
        }

        const refresh = {
            selector: badgesToSelector(),
            badges: badges
        };

        refresh.error = !validate(refresh.selector);

        if (!refresh.error) {
            props.root.rebuildStyling({
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
        const { validate, selectorToBadges } = this;
        const { value } = e.target;
        let refresh = {
            selector: value,
            error: !validate(value),
            badges: selectorToBadges()
        };

        if (!refresh.error) {
            this.props.root.rebuildStyling(e);
        }

        this.setState(refresh);
    };

    render() {

        const { props, state, isActive, toggle, submit } = this;
        const { config } = props;
        const { polyglot } = props.mainRoot;
        const { node, error } = state;
        const { uuid } = node;
        const { selector } = state;
        const Tree = node.tree ? node.tree : [];

        const tabProps = config.get('panels.selector.props.tab', {
            key: 'stylizer-tab-selector-' + uuid,
            className: 'stylizer-tab-content stylizer-content stylizer-tab-panel--selector'
        });

        const selectorProps = config.get('panels.selector.props.selector', {
            key: 'selector-form-' + uuid,
            className: ['stylizer-form-item', state.error ? 'stylizer-has-error' : ' '].join(' ').replace('  ', ' ')
        });

        const labelProps = config.get('panels.selector.props.label', {
            className: 'stylizer-form-label'
        });

        const inputProps = config.get('panels.selector.props.input', {
            key: 'input-selector-' + uuid,
            className: 'stylizer-form-input',
            type: 'text',
            name: 'selector',
            value: selector,
            onChange: submit
        });

        const errorProps = config.get('panels.selector.props.error', {
            key: 'input-selector-error-' + uuid,
            className: 'stylizer-error-bag'
        });

        const badgesProps = config.get('panels.selector.props.badges', {
            key: 'selector-badges-' + uuid,
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
                    { Tree.map((item, delta) => {
                        const badgeProps = config.get('panels.selector.props.badge', {
                            key: 'badges-' + delta,
                            onClick: () => { toggle(item) },
                            className: ['stylizer-selector-badge', isActive(item) ? 'active' : ' '].join(' ')
                        });
                        return (
                            <span { ...badgeProps }>
                                <span { ...badgeItemProps }>{ item }</span>
                                { Tree[delta + 1] && <ArrowIcon { ...badgeIconProps } /> }
                            </span>
                        )
                    }) }
                </div>
            </div>
        )
    };
}