import React from 'react';
import { get, forEach } from 'lodash';

/**
 * example variables that must be initialized in child class
    state = {
        node: false,
            errors: {},
            values: {}
        };

    testerNode = false;
    fields = [];
    config = {};
 */
export default class Panel extends React.Component {

    constructor(props) {
        super(props);
    };

    // @note Call this after injecting the state, config, fields via constructor
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
    }

    componentWillUnmount() {
        this.testerNode = null;
    }

    componentWillReceiveProps(nextProps) {
        if ('node' in nextProps && nextProps.node) {
            this.state.node = nextProps.node;
            this.setState({
                node: nextProps.node,
                values: this.getValues(),
                errors: this.validateValues()
            });
        }
    };

    getFields() {
        console.log(this.fields);
        return this.fields;
    }

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

    // @todo expand the field type into more element like select, textarea, colorpicker
    // and or special element items
    generateElement = (element) => {
        const { submit, state, hasError } = this;
        const elementProps = {
            key: 'stylizer-element-' + element.target + '-' + state.node.uuid,
            className: ['stylizer-form-item', element.inline ? 'stylizer-label-inline' : '', hasError(element.target) ? 'stylizer-has-error' : ''].join(' ')
        };

        const labelProps = {
            className: 'stylizer-form-label'
        };

        const inputProps = {
            key: 'input-' + element.target + '-' + state.node.uuid,
            className: 'stylizer-form-input',
            type: element.field,
            name: element.target,
            value: get(state, 'values.' + element.target, element.default),
            onChange: submit
        };

        const errorProps = {
            key: 'input-' + element.target + '-error-' + state.node.uuid,
            className: 'stylizer-error-bag'
        };

        return (
            <div { ...elementProps }>
                <label { ...labelProps }>{ element.title }</label>
                <input { ...inputProps } />
                { hasError(element.target) && element.error && <div { ...errorProps }>{ element.error }</div> }
            </div>
        )
    };

    generateGroup = (element) => {
        const { state, config, generateElement } = this;
        const elementProps = {
            key: 'stylizer-group-' + element.title + '-' + state.node.uuid,
            className: ['stylizer-form-group', element.inline ? 'stylizer-label-inline' : ''].join(' ')
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


    render() {

        const { fields, config, state, generateGroup, generateElement } = this;

        const tabProps = {
            key: 'stylizer-tab-' + config.type + '-' + state.node.uuid,
            className: 'stylizer-tab-content stylizer-content'
        };

        return (
            <div { ...tabProps }>
                { fields.map( (element) => {
                    switch (element.type) {
                        case 'group' :
                            return generateGroup(element);
                        case 'element' :
                            return generateElement(element);
                    }
                })}
            </div>
        )
    };
}