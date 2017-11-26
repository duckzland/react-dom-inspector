import React from 'react';
import { ChromePicker } from 'react-color';
import CloseIcon from '../../../node_modules/react-icons/lib/io/close-circled';
import { get } from 'lodash';

/**
 * Class for building the Editor ColorPicker elements
 *
 * @author jason.xie@victheme.com
 */
class ColorPicker extends React.Component {
    state = {
        displayColorPicker: false,
        value: '',
        color: {}
    };
    config = {};

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
    };

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value !== this.state.value) {
            this.state.value = nextProps.value;
        }
        this.reset();
    }

    show = () => {
        const { props, state, config, change, isOpen } = this;
        if (!isOpen()) {
            const chromeProps = get(config, 'ElementsColorPickerChromeProps', {
                color: state.color,
                onChange: change
            });

            props.root.mutateSpace('left', <ChromePicker { ...chromeProps } />, props.uuid);
        }
        this.setState({ displayColorPicker: true });
    };

    close = () => {
        this.props.root.mutateSpace('left', null, null, true);
        this.setState({ displayColorPicker: false })
    };

    change = (color) => {
        this.setState({
            color: color.rgb,
            value: this.convert(color)
        });

        this.props.onChange({
            target: {
                name: this.props.name,
                value: this.convert(color)
            }
        });
    };

    toggle = () => {
        const { isOpen, show, close } = this;
        !isOpen() ? show() : close();
    };

    convert = (color) => {
        if (color.rgb.a === 1 || color.rgb.a === 0) {
            return color.hex;
        }
        return 'rgba(' + color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b + ', ' + color.rgb.a + ')';
    };

    reset = () => {
        const { props } = this;
        if (props.uuid !== get(props, 'root.leftSpace.ownerKey')) {
            this.state.displayColorPicker = false;
        }
    };

    isOpen = () => {
        return this.state.displayColorPicker;
    };

    render() {
        const { props, state, config, toggle, show, close, isOpen } = this;
        const mainProps = get(config, 'ElementColorPickerMainProps', {
            className: props.className + ' stylizer-color-element'
        });

        const inputProps = get(config, 'ElementColorPickerInputProps', {
            type: 'text',
            value: state.value,
            onChange: props.onChange,
            onFocus: show
        });

        const spanPickerConst = get(config, 'ElementColorPickerSpanPickerConst', {
            className: 'stylizer-color-preview',
            onClick: toggle
        });

        const spanPickerContentConst = get(config, 'ElementColorPickerSpanPickerConst', {
            style: {
                backgroundColor: state.value
            },
            className: 'stylizer-color-preview-content'
        });

        const spanCloserConst = get(config, 'ElementColorPickerSpanCloserConst', {
            className: 'stylizer-color-closer',
            onClick: close
        });

        const closeIconProps = get(config, 'ElementColorPickerCloseIconProps', {
            size: 13
        });

        return (
            <div { ...mainProps } >
                <span { ...spanPickerConst }><span { ...spanPickerContentConst } /></span>
                <input { ...inputProps } />
                { isOpen() && <span { ...spanCloserConst } ><CloseIcon {...closeIconProps }/></span> }
            </div>
        )
    }
}

export default ColorPicker;