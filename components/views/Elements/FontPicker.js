import React from 'react';
import Autocomplete from 'react-autocomplete';
import FontLoader from '../../modules/FontLoader';
import { get, forEach } from 'lodash';

/**
 * Class for building the Editor FontPicker elements
 *
 * @author jason.xie@victheme.com
 */
export default class FontPicker extends React.Component {

    state = {
        value: null,
        options: [],
        family: false,
        weight: false,
        style: false,
        error: false
    };

    config = {};
    mode = null;
    loader = null;

    constructor(props) {
        super(props);

        if ('value' in props) {
            this.state.value = props.value;
        }

        if ('config' in props)  {
            Object.assign(this.config, props.config);

            this.loader = new FontLoader(get(this.config, 'googleFontAPI'));
            if (!this.loader.validateFont(get(props, 'family', ''), get(props, 'style', ''), get(props, 'weight', ''))) {
                props.root.setError(props.name);
            }
        }

        if ('root' in props) {
            this.state.root = props.root;
        }
        
        if ('family' in props) {
            this.state.family = props.family;
        }
        
        if ('style' in props) {
            this.state.style = props.style;
        }
        
        if ('weight' in props) {
            this.state.weight = props.weight;
        }

        if ('mode' in props && this.loader) {
            this.mode = props.mode;
            this.generateOptions(props.mode, get(props, 'family', ''), get(props, 'style', ''), get(props, 'weight', ''));
        }
    };

    componentWillReceiveProps(nextProps) {

        const { state } = this;

        if ('value' in nextProps && nextProps.value !== state.value) {
            state.value = nextProps.value;
        }

        if ('family' in nextProps) {
            state.family = nextProps.family;
        }

        if ('style' in nextProps) {
            state.style = nextProps.style;
        }

        if ('weight' in nextProps) {
            state.weight = nextProps.weight;
        }
        
        if ('mode' in nextProps) {
            this.generateOptions(nextProps.mode, state.family, state.style, state.weight);
        }
    }

    generateOptions = (mode, family = false, style = false, weight = false) => {
        let options = {};
        switch (mode) {
            case 'family' :
                options = this.loader.getFamily({
                    'Georgia': 'Georgia',
                    'Palatino Linotype': 'Palatino Linotype',
                    'Book Antiqua' : 'Book Antiqua',
                    'Palatino': 'Palatino',
                    'Times New Roman': 'Times New Roman',
                    'Times': 'Times',
                    'Arial': 'Arial',
                    'Helvetica': 'Helvetica',
                    'Arial Black': 'Arial Black',
                    'Gadget' : 'Gadget',
                    'Comic Sans MS': 'Comic Sans MS',
                    'cursive' : 'cursive',
                    'Impact': 'Impact',
                    'Charcoal': 'Charcoal',
                    'Lucida Sans Unicode': 'Lucida Sans Unicode',
                    'Lucida Grande': 'Lucida Grande',
                    'Tahoma' : 'Tahoma',
                    'Geneva' : 'Geneva',
                    'Trebuchet MS' : 'Trebuchet MS',
                    'Verdana' : 'Verdana',
                    'Courier New' : 'Courier New',
                    'Courier' : 'Courier',
                    'Lucida Console' : 'Lucida Console',
                    'Monaco' : 'Monaco'
                });
                break;

            case 'weight' :
                options = this.loader.getWeight(family, style, weight, {
                    100: '100',
                    200: '200',
                    300: '300',
                    400: '400',
                    500: '500',
                    600: '600',
                    700: '700',
                    800: '800',
                    900: '900'
                });
                break;

            case 'style' :
                options = this.loader.getStyle(family, style, weight,  {
                    normal: 'Normal',
                    italic: 'Italic',
                    oblique: 'Oblique'
                });
                break;
        }

        this.state.options = options;
    };

    change = (e) => {
        const { props, state, loader } = this;

        state[props.mode] = state.value = e.target.value;
        const { family, style, weight } = state;

        this.generateOptions(props.mode, family, style, weight);

        if (loader.validateFont(family, style, weight)) {
            loader.insertFont(family, style, weight);
            props.root.removeError(props.name);
        }
        else {
            props.root.setError(props.name);
        }

        props.onChange({
            target: {
                skipValidation: true,
                name: props.name,
                value: e.target.value
            }
        });

    };

    render() {
        const { props, state, config, mode, change } = this;
        const mainProps = get(config, 'ElementFontPickerMainProps', {
            className: props.className + ' stylizer-font-element stylizer-font-element--' + mode
        });

        let inputProps = get(config, 'ElementFontPickerInputProps', {
            name: 'font-' + mode,
            value: state.value,
            onChange: change
        });

        let options = [];
        switch (mode) {
            case 'family' :

                mainProps.className += ' stylizer-font-element-autocomplete';
                inputProps.items = [];
                forEach(state.options, (text, value) => {
                    inputProps.items.push({label: text});
                });
                inputProps.onSelect = (val) => {
                    change({ target: { value: val }});
                };
                inputProps.getItemValue = (item) => item.label;
                inputProps.shouldItemRender = (item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                inputProps.renderMenu = (items, value, style) => {
                    const menuProps = get(config, 'ElementFontPickerDropdownMenuProps', {
                        className: 'stylizer-font-element-dropdown',
                        children: items
                    });
                    return ( <div { ...menuProps } /> )
                };
                inputProps.renderItem = (item, isHighlighted) => {
                    const optionProps = get(config, 'ElementFontPickerAutoCompleteProps', {
                        key: 'stylizer-option-' + props.name + '-' + item.label,
                        className:  'stylizer-font-element-dropdown-item ' +  isHighlighted ? 'active' : ''
                    });
                    return (
                        <div { ...optionProps }>{ item.label }</div>
                    );
                };
                break;

            case 'weight' :
            case 'style' :
                if (Object.keys(state.options).length > 0) {
                    const optionEmptyProps = get(config, 'ElementFontPickerOptionEmptyProps', {
                        key: 'stylizer-option-' + props.name + '-empty',
                        value: ''
                    });

                    options.push(<option { ...optionEmptyProps }>{ null }</option>);
                    forEach(state.options, (text, value) => {
                        const optionProps = get(config, 'ElementFontPickerOptionProps', {
                            key: 'stylizer-option-' + props.name + '-' + value.replace(' ', '-'),
                            value: value
                        });
                        options.push(<option { ...optionProps }>{ text }</option>);
                    });
                }
            break;
        }

        return (
            <div { ...mainProps } >
                { mode === 'family'
                    ? <Autocomplete { ...inputProps } />
                    : Object.keys(state.options).length > 0
                        ? <select { ...inputProps }>{ options }</select>
                        : <input type="text" value="Not Available" disabled/>
                }
            </div>
        )
    }
}