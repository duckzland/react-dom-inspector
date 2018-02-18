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

        this.config = new Configurator();

        if ('config' in props)  {
            this.config.insert(props.config);
        }

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
        const { root } = props;

        const mainProps = config.get('ElementBoxShadowMainProps', {
            className: 'stylizer-form-row stylizer-box-shadow-element'
        });

        const labelProps = config.get('ElementBoxShadowLabelProps', {
            className: 'stylizer-form-label'
        });

        const wrapperProps = config.get('ElementBoxShadowWrapperProps', {
            className: 'stylizer-form-item'
        });

        const ColorProps = config.get('ElementBoxShadowColorElementProps', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-color',
            value: state.color,
            name: 'color',
            onChange: onChange,
            root: root
        });

        const HShadowProps = config.get('ElementBoxShadowHShadowElementProps', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-hshadow',
            value: state.hshadow,
            name: 'hshadow',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const VShadowProps = config.get('ElementBoxShadowVShadowElementProps', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-vshadow',
            value: state.vshadow,
            name: 'vshadow',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const BlurProps = config.get('ElementBoxShadowBlurElementProps', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-blur',
            value: state.blur,
            name: 'blur',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const SpreadProps = config.get('ElementBoxShadowSpreadElementProps', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-spread',
            value: state.spread,
            name: 'spread',
            type: 'text',
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const InsetProps = config.get('ElementBoxShadowInsetElementProps', {
            className: 'stylizer-form-input stylizer-form-input--boxshadow-inset',
            value: state.inset,
            name: 'inset',
            onChange: onChange
        });

        return (
            <div { ...mainProps } >
                <div { ...wrapperProps }>
                    <label { ...labelProps }>Color</label>
                    <ColorPicker { ...ColorProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>H-Shadow</label>
                    <input { ...HShadowProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>V-Shadow</label>
                    <input { ...VShadowProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>Blur</label>
                    <input { ...BlurProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>Spread</label>
                    <input { ...SpreadProps } />
                </div>
                <div { ...wrapperProps }>
                    <label { ...labelProps }>Inset</label>
                    <select { ...InsetProps }>
                        <option key="inset-initial" value="initial">No Inset</option>
                        <option key="inset-inset" value="inset">Inset</option>
                        <option key="inset-inherit" value="inherit">Inherit</option>
                    </select>
                </div>
            </div>
        );
    }
}