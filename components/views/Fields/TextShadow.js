import React from 'react';
import ColorPicker from '../Elements/ColorPicker';
import TextShadowParser from '../../modules/TextShadowParser';

import { forEach } from 'lodash';

/**
 * Class for building the Box Shadow elements
 *
 * @author jason.xie@victheme.com
 */
export default class TextShadow extends React.Component {
    
    state = {
        value: '',
        color: '',
        hshadow: '',
        vshadow: '',
        blur: ''
    };

    constructor(props) {
        super(props);
        if ('value' in props) {
            const Parsed = props.value ? (new TextShadowParser(props.value)) : false;
            Parsed && forEach(Parsed, (val, key) => {
                this.state[key] = val;
            });
        }
    };

    onChange = (e) => {
        const { state, onSubmit } = this;
        state[e.target.name] = e.target.value;
        onSubmit();
        this.setState(state);
    };

    onSubmit = () => {
        const { state, props } = this;
        const { hshadow, vshadow, blur, color } = state;
        let value = [
            hshadow,
            vshadow,
            blur,
            color
        ].join(' ').trim();

        props.onChange && props.onChange({
            target: {
                skipValidation: true,
                name: 'text-shadow',
                value: value
            }
        });
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
            this.onChange(e);
        }
    };


    render() {
        const { props, onChange, onKeypress, state } = this;
        const { root, mainRoot, config } = props;
        const { polyglot } = mainRoot;

        const mainProps = config.get('ElementTextShadowMainProps', {
            className: 'stylizer-form-row stylizer-text-shadow-element'
        });

        const labelProps = config.get('ElementTextShadowLabelProps', {
            className: 'stylizer-form-label'
        });

        const wrapperProps = config.get('ElementTextShadowWrapperProps', {
            className: 'stylizer-form-item'
        });

        const ColorProps = config.get('ElementTextShadowColorElementProps', {
            className: 'stylizer-form-input',
            value: state.color,
            name: 'color',
            onChange: onChange,
            root: root,
            config: config
        });

        const HShadowProps = config.get('ElementTextShadowHShadowElementProps', {
            className: 'stylizer-form-input',
            value: state.hshadow,
            name: 'hshadow',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const VShadowProps = config.get('ElementTextShadowVShadowElementProps', {
            className: 'stylizer-form-input',
            value: state.vshadow,
            name: 'vshadow',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const BlurProps = config.get('ElementTextShadowBlurElementProps', {
            className: 'stylizer-form-input',
            value: state.blur,
            name: 'blur',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        return (
            <div { ...mainProps } >
                <div { ...wrapperProps }>
                    <label { ...labelProps }>{ polyglot.t('Color') }</label>
                    <ColorPicker { ...ColorProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>{ polyglot.t('H-Shadow') }</label>
                    <input { ...HShadowProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>{ polyglot.t('V-Shadow') }</label>
                    <input { ...VShadowProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>{ polyglot.t('Blur') }</label>
                    <input { ...BlurProps } />
                </div>
            </div>
        );
    }
}