import React from 'react';
import ScrollArea from 'react-scrollbar';
import ColorPicker  from './Elements/ColorPicker';
import FontPicker from './Elements/FontPicker';
import GradientPicker from './Elements/GradientPicker';
import ImagePicker from './Elements/ImagePicker';
import ToggleOpenIcon from '../../node_modules/react-icons/lib/fa/unlock';
import ToggleLockedIcon from '../../node_modules/react-icons/lib/fa/lock';
import { get, forEach } from 'lodash';

/**
 * Base Class for Creating Editor Panels
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

    initialize(props) {
        this.testerNode = document.createElement('span');

        if ('node' in props && props.node) {
            this.state.node = props.node;
            this.state.values = this.getValues();
            this.state.errors = this.validateValues();
        }

        if (!'fields' in this) {
            this.fields = [];
        }
    }

    componentWillUnmount() {
        this.testerNode = null;
    }

    componentWillReceiveProps(nextProps) {
        if ('node' in nextProps && nextProps.node) {
            this.state.node = nextProps.node;
            this.state.values = this.getValues();
            this.state.errors = this.validateValues();
        }

        if ('scroll' in nextProps) {
            this.state.scroll = nextProps.scroll;
        }
    };

    hasError = (key) => {
        return this.state.errors[key] ? this.state.errors[key] : false;
    };

    setError = (key, refresh = true) => {
        this.state.errors[key] = true;
        refresh && this.setState(this.state);
    };

    removeError = (key, refresh = true) => {
        this.state.errors[key] = false;
        refresh && this.setState(this.state);
    } ;

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
                this.state.values[element.target] = node.getStyle(element.target);
                break;
        }
    };

    validate = (directive, rule) => {
        const { testerNode } = this;

        testerNode.style[directive] = rule;
        return (directive.indexOf('color') === -1) ? testerNode.style[directive] === rule : testerNode.style[directive].length !== 0;
    };

    validateValues = () => {
        const { state, validate } = this;
        state.errors = {};
        forEach(state.values, (rule, directive) => {
            state.errors[rule] = validate(directive, rule);
        });
        return state.errors;
    };

    generateElement = (element) => {
        const { onKeypress, onSubmit, state, props, hasError, hookBeforeElementRender } = this;
        const { config } = props;

        const elementProps = config.get('panels.props.fields.' + element.target, {
            key: 'stylizer-element-' + element.target + '-' + state.node.uuid,
            className: [
                'stylizer-form-item',
                'stylizer-field--' + element.target.replace(' ', '-'),
                element.inline ? 'stylizer-label-inline' : '',
                hasError(element.target) ? 'stylizer-has-error' : ''
            ].join(' ')
        });

        const labelProps = config.get('panels.props.labels.' + element.target, {
            className: 'stylizer-form-label'
        });

        const inputProps = config.get('panels.props.inputs.' + element.target, {
            key: 'input-' + element.target + '-' + state.node.uuid,
            uuid: 'input-' + element.target + '-' + state.node.uuid,
            className: 'stylizer-form-input',
            type: element.field,
            name: element.target,
            value: get(state, 'values.' + element.target, element.default),
            root: this,
            config: config,
            mainRoot: props.mainRoot,
            onChange: onSubmit
        });

        const errorProps = config.get('panels.props.errors.' + element.target, {
            key: 'input-' + element.target + '-error-' + state.node.uuid,
            className: 'stylizer-error-bag'
        });

        let InputElement = [];

        switch (element.field) {
            case 'text' :
                inputProps.onKeyDown = onKeypress;
                InputElement.push( <input { ...inputProps } /> );
                break;

            case 'color' :
                InputElement.push( <ColorPicker { ...inputProps } /> );
                break;

            case 'font' :
                inputProps.mode = element.mode;
                inputProps.fontLoaderObject = props.fontLoaderObject;
                inputProps.family = get(state, 'values.font-family');
                inputProps.weight = get(state, 'values.font-weight');
                inputProps.style = get(state, 'values.font-style');
                InputElement.push( <FontPicker { ...inputProps } />);
                break;

            case 'select' :
                let options = [];
                if (element.options) {
                    const optionEmptyProps = config.get('panels.props.selectOptionsEmpty', {
                        key: 'stylizer-option-' + element.target + '-empty',
                        value: ''
                    });
                    options.push( <option { ...optionEmptyProps }>{ null }</option> );
                    forEach(element.options, (text, value) => {
                        const optionProps = config.get('panels.props.selectOptions', {
                            key: 'stylizer-option-' + element.target + text.replace(' ', '-'),
                            value: value
                        });
                        options.push( <option { ...optionProps }>{ text }</option> );
                    });
                }
                InputElement.push( <select { ...inputProps }>{ options }</select> );
                break;

            case 'gradient' :
                InputElement.push( <GradientPicker { ...inputProps } /> );
                break;

            case 'image' :
                inputProps.imageLoaderObject = props.imageLoaderObject;
                InputElement.push( <ImagePicker { ...inputProps } /> );
                break;
        }

        hookBeforeElementRender && hookBeforeElementRender(element, InputElement, inputProps);

        return (
            <div { ...elementProps }>
                <label { ...labelProps }>{ element.title }</label>
                { InputElement }
                { hasError(element.target) && element.error && <div { ...errorProps }>{ element.error }</div> }
            </div>
        )
    };

    generateToggle = (element) => {
        const { onToggleLock } = this;
        this.toggleOpenIcon = (<ToggleOpenIcon size={ 14 } onClick={ () => onToggleLock(element) }/>);
        this.toggleCloseIcon = (<ToggleLockedIcon size={ 14 } onClick={ () => onToggleLock(element) }/>);
    };

    generateGroup = (element) => {

        this.generateToggle(element);

        const { state, props, generateElement, toggleOpenIcon, toggleCloseIcon} = this;
        const { config } = props;

        const elementProps = config.get('panels.props.groupElement', {
            key: 'stylizer-group-' + element.title + '-' + state.node.uuid,
            className: ['stylizer-form-group', 'stylizer-group--' + element.key.replace(' ', '-'), element.inline ? 'stylizer-label-inline' : ''].join(' ')
        });

        const headingProps = config.get('panels.props.groupHeading', {
            className: 'stylizer-form-header'
        });

        const wrapperProps = config.get('panels.props.groupWrapper', {
            className: 'stylizer-form-row'
        });

        return (
            <div { ...elementProps }>
                { (element.title || element.toggle )
                    && <h3 { ...headingProps }>
                        { element.title && element.title }
                        { element.toggle && element.toggle === 'on' && toggleOpenIcon }
                        { element.toggle && element.toggle === 'off' && toggleCloseIcon }
                    </h3>
                }
                <div { ...wrapperProps }>
                    { element.elements
                        ? element.elements.map( (child) => { return generateElement(child) })
                        : config.get('panel.group.empty', null)
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

    submit = (e) => {
        const { hasError } = this;
        const { value, name } = e.target;
        let refresh = {
            values: this.state.values,
            errors: this.state.errors
        };

        refresh.values[name] = value;
        if (!get(e, 'target.skipValidation', false)) {
            refresh.errors[name] = !this.validate(name, value);
        }

        if (!hasError(name)) {
            this.props.root.rebuildStyling(e);
        }

        this.setState(refresh);
    };

    onToggleLock = (element) => {};

    onSubmit = (e) => {
        this.submit(e);
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
            this.onSubmit(e);
        }
    };

    onScroll = (value) => {
        this.setState({
            scroll: value,
            scrolledLeft: value.leftPosition,
            scrolledtop: value.topPosition,
            hasVerticalScrollbar: value.containerHeight < value.realHeight,
            hasHorizontalScrollbar: value.containerWidth < value.realWidth
        });
    };

    render() {

        const { leftSpace, rightSpace, fields, props, state, generateGroup, generateElement, onScroll, hookBeforeRender } = this;
        const { config } = props;

        const tabProps = config.get('panels.props.tabs', {
            key: 'stylizer-tab-' + config.get('type') + '-' + state.node.uuid,
            className: 'stylizer-tab-content stylizer-content-flex stylizer-tab-panel--' + config.get('type')
        });

        const leftSpaceProps = config.get('panels.props.leftSpace', {
            key: 'stylizer-panel-left-space',
            className: 'stylizer-panel-left-space'
        });

        const centerSpaceProps = config.get('panels.props.centerSpace', {
            key: 'stylizer-panel-center-space',
            className: 'stylizer-panel-center-space'
        });

        const rightSpaceProps = config.get('panels.props.rightSpace', {
            key: 'stylizer-panel-right-space',
            className: 'stylizer-panel-right-space'
        });

        const scrollAreaProps = config.get('panels.props.scrollArea', {
            key: "stylizer-tab-contents",
            speed: 0.8,
            className: [
                'stylizer-tabs-contents',
                state.hasHorizontalScrollbar ? 'horizontal-scrollbar' : '',
                state.hasVerticalScrollbar > 0 ? 'has-vertical-scrollbar': ''
            ].join(' '),
            contentClassName: "content",
            horizontal: true,
            onScroll: onScroll
        });

        hookBeforeRender && hookBeforeRender();

        return (
            <div { ...tabProps }>
                { leftSpace.content && <div { ...leftSpaceProps }>{ leftSpace.content }</div> }
                <ScrollArea { ...scrollAreaProps }>
                    <div { ...centerSpaceProps}>
                        { fields.map((element) => {
                            switch (element.type) {
                                case 'group' :
                                    return generateGroup(element);
                                case 'element' :
                                    return generateElement(element);
                            }
                        })}
                    </div>
                </ScrollArea>
                { rightSpace.content && <div { ...rightSpaceProps}>{ rightSpace.content }</div> }
            </div>
        )
    };
}