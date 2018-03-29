import React from 'react';
import Configurator from '../../modules/Config';
import ColorPicker from '../Elements/ColorPicker';
import BoxShadowParser from '../../modules/BoxShadowParser';

import { forEach } from 'lodash';

/**
 * Class for building the Box Shadow elements
 *
 * @author jason.xie@victheme.com
 */
export default class BoxShadow extends React.Component {
    
    state = {
        value: '',
        color: '',
        hshadow: '',
        vshadow: '',
        blur: '',
        spread: '',
        inset: ''
    };
    
    config = false;

    constructor(props) {
        super(props);
        if ('value' in props) {
            const Parsed = props.value ? (new BoxShadowParser(props.value)) : false;
            Parsed && forEach(Parsed, (val, key) => {
                this.state[key] = val;
            });
        }

        this.config = 'config' in props ? props.config : new Configurator();

        if ('root' in props) {
            this.state.root = props.root;
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
        let value = [
            state.hshadow,
            state.vshadow,
            state.blur,
            state.spread,
            state.color,
            state.inset
        ].join(' ').trim();

        props.onChange && props.onChange({
            target: {
                skipValidation: true,
                name: 'box-shadow',
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

        const { props, config, onChange, onKeypress, state } = this;
        const { root, mainRoot } = props;
        const { polyglot } = mainRoot;

        const mainProps = config.get('fields.boxShadow.props.main', {
            className: 'stylizer-form-row stylizer-box-shadow-element'
        });

        const labelProps = config.get('fields.boxShadow.props.label', {
            className: 'stylizer-form-label'
        });

        const wrapperProps = config.get('fields.boxShadow.props.wrapper', {
            className: 'stylizer-form-item'
        });

        const ColorProps = config.get('fields.boxShadow.props.color', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-color',
            value: state.color,
            name: 'color',
            onChange: onChange,
            root: root
        });

        const HShadowProps = config.get('fields.boxShadow.props.hshadow', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-hshadow',
            value: state.hshadow,
            name: 'hshadow',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const VShadowProps = config.get('fields.boxShadow.props.vshadow', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-vshadow',
            value: state.vshadow,
            name: 'vshadow',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const BlurProps = config.get('fields.boxShadow.props.blur', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-blur',
            value: state.blur,
            name: 'blur',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const SpreadProps = config.get('fields.boxShadow.props.spread', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-spread',
            value: state.spread,
            name: 'spread',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const InsetProps = config.get('fields.boxShadow.props.inset', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-inset',
            value: state.inset,
            name: 'inset',
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
                <div { ...wrapperProps }>
                    <label { ...labelProps }>{ polyglot.t('Spread') }</label>
                    <input { ...SpreadProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>{ polyglot.t('Inset') }</label>
                    <select { ...InsetProps }>
                        <option key="inset-initial" value="initial">{ polyglot.t('No Inset') }</option>
                        <option key="inset-inset" value="inset">{ polyglot.t('Inset') }</option>
                        <option key="inset-inherit" value="inherit">{ polyglot.t('Inherit') }</option>
                    </select>
                </div>
            </div>
        );
    }
}