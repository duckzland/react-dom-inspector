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
        options: []
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
        }

        if ('root' in props) {
            this.state.root = props.root;
        }

        if ('mode' in props) {
            this.mode = props.mode;
        }

        this.loader = new FontLoader(get(this.config, 'googleFontAPI'));
    };

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value !== this.state.value) {
            this.state.value = nextProps.value;
        }
        if ('mode' in nextProps) {
            this.generateOptions(nextProps.mode, get(nextProps, 'family', ''));
        }
    }

    generateOptions = (mode, family = false) => {
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
                options = this.loader.getWeight(family, {
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
                options = this.loader.getStyle(family, {
                    normal: 'Normal',
                    italic: 'Italic',
                    oblique: 'Oblique'
                });
                break;
        }

        this.state.options = options;
    };

    change = (e) => {
        this.setState({
            value: e.target.value
        });

        this.props.onChange({
            target: {
                name: this.props.name,
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
            value: state.value,
            onChange: change
        });

        let options = [];
        switch (mode) {
            case 'family' :

                inputProps.items = [];
                forEach(state.options, (text, value) => {
                    inputProps.items.push({label: text});
                });
                inputProps.onSelect = (val) => {
                    change({ target: { value: val }});
                };
                inputProps.getItemValue = (item) => item.label;
                inputProps.shouldItemRender = (item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                inputProps.renderItem = (item, isHighlighted) => {
                    const optionProps = get(config, 'ElementFontPickerAutoCompleteProps', {
                        key: 'stylizer-option-' + props.name + '-' + item.label,
                        className: isHighlighted ? 'active' : ''
                    });
                    return (
                        <div { ...optionProps } style={{ background: isHighlighted ? 'lightgray' : 'white' }}> {item.label}</div>
                    );
                };
                break;

            case 'weight' :
            case 'style' :
                forEach(state.options, (text, value) => {
                    const optionProps = get(config, 'ElementFontPickerOptionProps', {
                        key: 'stylizer-option-' + props.name + '-' + value.replace(' ', '-'),
                        value: value
                    });
                    options.push(<option { ...optionProps }>{ text }</option>);
                });
            break;
        }

        return (
            <div { ...mainProps } >
                {
                    mode === 'family'
                        ? <Autocomplete { ...inputProps } />
                        : <select { ...inputProps }>{ options }</select>
                }
            </div>
        )
    }
}