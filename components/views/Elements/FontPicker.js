import React from 'react';
import Autocomplete from 'react-autocomplete';
import Configurator from '../../modules/Config';
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

    config = false;
    mode = null;
    loader = null;
    polyglot = false;

    constructor(props) {
        super(props);

        if ('value' in props) {
            this.state.value = props.value;
        }

        this.config = new Configurator();

        if ('config' in props)  {
            this.config.insert(props.config);
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
        
        this.polyglot = props.mainRoot.polyglot;

        this.loader = props.fontLoaderObject
            ? props.fontLoaderObject
            : new FontLoader(this.config.get('googleFontAPI', false));

        if (!this.loader.validate(
                get(props, 'family', ''),
                get(props, 'style', ''),
                get(props, 'weight', ''))
        ) {
            props.root.setError(props.name);
        }

        if ('mode' in props && this.loader) {
            this.mode = props.mode;
            this.generateOptions(
                props.mode,
                get(props, 'family', ''),
                get(props, 'style', ''),
                get(props, 'weight', '')
            );
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
        const { polyglot } = this;
        let options = {};
        switch (mode) {
            case 'family' :
                options = this.loader.getFamily({
                    'Georgia': polyglot.t('Georgia'),
                    'Palatino Linotype': polyglot.t('Palatino Linotype'),
                    'Book Antiqua' : polyglot.t('Book Antiqua'),
                    'Palatino': polyglot.t('Palatino'),
                    'Times New Roman': polyglot.t('Times New Roman'),
                    'Times': polyglot.t('Times'),
                    'Arial': polyglot.t('Arial'),
                    'Helvetica': polyglot.t('Helvetica'),
                    'Arial Black': polyglot.t('Arial Black'),
                    'Gadget' : polyglot.t('Gadget'),
                    'Comic Sans MS': polyglot.t('Comic Sans MS'),
                    'cursive' : polyglot.t('cursive'),
                    'Impact': polyglot.t('Impact'),
                    'Charcoal': polyglot.t('Charcoal'),
                    'Lucida Sans Unicode': polyglot.t('Lucida Sans Unicode'),
                    'Lucida Grande': polyglot.t('Lucida Grande'),
                    'Tahoma' : polyglot.t('Tahoma'),
                    'Geneva' : polyglot.t('Geneva'),
                    'Trebuchet MS' : polyglot.t('Trebuchet MS'),
                    'Verdana' : polyglot.t('Verdana'),
                    'Courier New' : polyglot.t('Courier New'),
                    'Courier' : polyglot.t('Courier'),
                    'Lucida Console' : polyglot.t('Lucida Console'),
                    'Monaco' : polyglot.t('Monaco')
                });
                break;

            case 'weight' :
                options = this.loader.getWeight(family, style, weight, {
                    100: polyglot.t('100'),
                    200: polyglot.t('200'),
                    300: polyglot.t('300'),
                    400: polyglot.t('400'),
                    500: polyglot.t('500'),
                    600: polyglot.t('600'),
                    700: polyglot.t('700'),
                    800: polyglot.t('800'),
                    900: polyglot.t('900')
                });
                break;

            case 'style' :
                options = this.loader.getStyle(family, style, weight,  {
                    normal: polyglot.t('Normal'),
                    italic: polyglot.t('Italic'),
                    oblique: polyglot.t('Oblique')
                });
                break;
        }

        this.state.options = options;
    };

    change = (e) => {
        const { props, state, loader, generateOptions } = this;

        state[props.mode] = state.value = e.target.value;
        const { family, style, weight } = state;

        generateOptions(props.mode, family, style, weight);

        if (loader.validate(family, style, weight)) {
            loader.insert(family, style, weight);
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
        const mainProps = config.get('ElementFontPickerMainProps', {
            className: props.className + ' stylizer-font-element stylizer-font-element--' + mode
        });

        let inputProps = config.get('ElementFontPickerInputProps', {
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
                    const menuProps = config.get('ElementFontPickerDropdownMenuProps', {
                        className: 'stylizer-font-element-dropdown',
                        children: items
                    });
                    return ( <div { ...menuProps } /> )
                };
                inputProps.renderItem = (item, isHighlighted) => {
                    const optionProps = config.get('ElementFontPickerAutoCompleteProps', {
                        key: 'stylizer-option-' + props.name + '-' + item.label,
                        className: 'stylizer-font-element-dropdown-item ' +  isHighlighted ? 'active' : ''
                    });
                    return (
                        <div { ...optionProps }>{ item.label }</div>
                    );
                };
                break;

            case 'weight' :
            case 'style' :
                switch (Object.keys(state.options).length) {
                    case 0 :
                        inputProps.type = 'text';
                        inputProps.disabled = true;
                        inputProps.value = 'none';

                        delete inputProps.name;
                        break;

                    case 1 :
                        inputProps.type = 'text';
                        inputProps.disabled = true;
                        inputProps.value = Object.keys(state.options)[0];
                        break;

                    default :
                        const optionEmptyProps = config.get('ElementFontPickerOptionEmptyProps', {
                            key: 'stylizer-option-' + props.name + '-empty',
                            value: ''
                        });

                        options.push(<option { ...optionEmptyProps }>{ null }</option>);
                        forEach(state.options, (text, value) => {
                            const optionProps = config.get('ElementFontPickerOptionProps', {
                                key: 'stylizer-option-' + props.name + '-' + value.replace(' ', '-'),
                                value: value
                            });
                            options.push(<option { ...optionProps }>{ text }</option>);
                        });
                        break;
                }
            break;
        }

        return (
            <div { ...mainProps } >
                { mode === 'family'
                    ? <Autocomplete { ...inputProps } />
                    : Object.keys(state.options).length > 1
                        ?  <select { ...inputProps }>{ options }</select>
                        : <input { ...inputProps } />
                }
            </div>
        )
    }
}