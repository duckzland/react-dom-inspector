import React from 'react';
import ColorPicker  from './Elements/ColorPicker';
import { get, forEach } from 'lodash';

/**
 * Base Class for Panels
 *
 * @author jason.xie@victheme.com
 */
export default class Panel extends React.Component {

    leftSpace = {
        ownerKey: null,
        content: null
    };

    rightSpace = {
        ownerKey: null,
        content: null
    };

    constructor(props) {
        super(props);
    };

    initialize(props) {
        this.testerNode = document.createElement('span');

        if ('node' in props && props.node) {
            this.state.node = props.node;
            this.state.values = this.getValues();
            this.state.errors = this.validateValues();
        }

        if ('config' in props && props.config) {
            this.config = props.config;
        }

        if (!'config' in this) {
            this.config = {};
        }

        if (!'fields' in this) {
            this.fields = [];
        }
    }

    componentWillUnmount() {
        this.testerNode = null;
    }

    componentWillReceiveProps(nextProps) {
        let refresh = {};
        if ('node' in nextProps && nextProps.node) {
            this.state.node = nextProps.node;
            refresh = {
                node: nextProps.node,
                values: this.getValues(),
                errors: this.validateValues()
            };
        }

        if ('scroll' in nextProps) {
            refresh.scroll = nextProps.scroll;
        }

        this.setState(refresh);
    };

    validate = (directive, rule) => {
        this.testerNode.style[directive] = rule;
        if (directive.indexOf('color') === -1) {
            return this.testerNode.style[directive] === rule;
        }
        else {
            return this.testerNode.style[directive].length !== 0;
        }
    };

    hasError = (key) => {
        return this.state.errors[key] ? this.state.errors[key] : false;
    };

    getValues = () => {
        const { fields } = this;
        this.state.values = {};
        forEach(fields, (field) => {
            this.getValue(field);
        });
        return this.state.values;
    };

    getValue = (element) => {
        const { getValue, state } = this;
        const { node } = state;
        switch (element.type) {
            case 'group' :
                forEach(element.elements, (child) => getValue(child));
                break;
            case 'element' :
                this.state.values[element.target] = get(node.styles, element.target);
                break;
        }
    };

    validateValues = () => {
        const { state, validate } = this;
        state.errors = {};
        forEach(state.values, (rule, directive) => {
            state.errors[rule] = validate(directive, rule);
        });
        return state.errors;
    };

    submit = (e) => {
        const { hasError } = this;
        const { value, name } = e.target;
        let refresh = {
            values: this.state.values,
            errors: this.state.errors
        };
        refresh.values[name] = value;
        refresh.errors[name] = !this.validate(name, value);

        if (!hasError(name)) {
            this.props.root.rebuildStyling(e);
        }

        this.setState(refresh);
    };

    onKeypress = (e) => {
        let maybeNumber = e.target.value.match(/-?\d*(\d+)/g);
        if (maybeNumber && maybeNumber[0]) {
            let oldValue = maybeNumber[0], newNumber = parseFloat(maybeNumber[0]);
            switch (e.key) {
                case 'ArrowUp':
                    newNumber++;
                    break;
                case 'ArrowDown':
                    newNumber--;
                    break;
            }

            e.target.value = e.target.value.replace(oldValue, newNumber);
            this.submit(e);
        }
    };

    generateElement = (element) => {
        const { onKeypress, submit, state, hasError, config } = this;
        const elementProps = {
            key: 'stylizer-element-' + element.target + '-' + state.node.uuid,
            className: [
                'stylizer-form-item',
                'stylizer-field--' + element.target.replace(' ', '-'),
                element.inline ? 'stylizer-label-inline' : '', hasError(element.target) ? 'stylizer-has-error' : ''
            ].join(' ')
        };

        const labelProps = {
            className: 'stylizer-form-label'
        };

        const inputProps = {
            key: 'input-' + element.target + '-' + state.node.uuid,
            uuid: 'input-' + element.target + '-' + state.node.uuid,
            className: 'stylizer-form-input',
            type: element.field,
            name: element.target,
            value: get(state, 'values.' + element.target, element.default),
            root: this,
            onChange: submit
        };

        const errorProps = {
            key: 'input-' + element.target + '-error-' + state.node.uuid,
            className: 'stylizer-error-bag'
        };

        let InputElement = [];
        switch (element.field) {
            case 'text' :
                inputProps.onKeyDown = onKeypress;
                InputElement.push( <input { ...inputProps } /> );
                break;

            case 'color' :
                InputElement.push( <ColorPicker { ...inputProps } /> );
                break;

            case 'select' :
                let options = [];
                if (element.options) {
                    forEach(element.options, (text, value) => {
                        const optionProps = get(config, 'optionProps', {
                            key: 'stylizer-option-' + element.target + text.replace(' ', '-'),
                            value: value
                        });
                        options.push(<option { ...optionProps }>{ text }</option>);
                    });
                }
                InputElement.push(
                    <select { ...inputProps }>
                        { options }
                    </select>
                );
                break;
        }


        return (
            <div { ...elementProps }>
                <label { ...labelProps }>{ element.title }</label>
                { InputElement }
                { hasError(element.target) && element.error && <div { ...errorProps }>{ element.error }</div> }
            </div>
        )
    };

    generateGroup = (element) => {
        const { state, config, generateElement } = this;
        const elementProps = {
            key: 'stylizer-group-' + element.title + '-' + state.node.uuid,
            className: ['stylizer-form-group', 'stylizer-group--' + element.key.replace(' ', '-'), element.inline ? 'stylizer-label-inline' : ''].join(' ')
        };

        const headingProps = {
            className: 'stylizer-form-header'
        };

        const wrapperProps = {
            className: 'stylizer-form-row'
        };

        return (
            <div { ...elementProps }>
                { element.title && <h3 { ...headingProps }>{ element.title }</h3> }
                <div { ...wrapperProps }>
                    { element.elements
                        ? element.elements.map( (child) => { return generateElement(child) })
                        : config.empty
                    }
                </div>
            </div>
        )
    };


    mutateSpace(direction, content, ownerKey, wipe = false) {

        const Space = this[direction + 'Space'];

        // OwnerKey is to prevent infinite loops since child component will invoke the mutation
        if (Space.ownerKey === ownerKey) {
            return;
        }

        if (wipe) {
            Space.ownerKey = null;
            Space.content = null;
        }
        else {
            if ( Space.content !== content) {
                Space.content = content;
            }
        }

        this.setState({ updateSpace: true });
        Space.ownerKey = ownerKey;
    }

    render() {

        const { leftSpace, rightSpace, fields, config, state, generateGroup, generateElement } = this;

        const tabProps = {
            key: 'stylizer-tab-' + config.type + '-' + state.node.uuid,
            className: 'stylizer-tab-content stylizer-content-flex stylizer-tab-panel--' + config.type
        };

        const leftSpaceProps = {
            key: 'stylizer-panel-left-space',
            className: 'stylizer-panel-left-space',
            style: { paddingTop: (state.scroll && state.scroll.topPosition ? state.scroll.topPosition : 0) + 15 + 'px'}
        };

        const centerSpaceProps = {
            key: 'stylizer-panel-center-space',
            className: 'stylizer-panel-center-space'
        };

        const rightSpaceProps = {
            key: 'stylizer-panel-right-space',
            className: 'stylizer-panel-right-space'
        };

        return (
            <div { ...tabProps }>
                { leftSpace.content && <div { ...leftSpaceProps }>{ leftSpace.content }</div> }
                <div { ...centerSpaceProps}>
                    { fields.map( (element) => {
                        switch (element.type) {
                            case 'group' :
                                return generateGroup(element);
                            case 'element' :
                                return generateElement(element);
                        }
                    })}
                </div>
                { rightSpace.content && <div { ...rightSpaceProps}>{ rightSpace.content }</div> }
            </div>
        )
    };
}