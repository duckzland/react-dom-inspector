import React from 'react';
import { ChromePicker } from 'react-color';
import CloseIcon from '../../../node_modules/react-icons/lib/io/close-circled';
import TrashIcon from '../../../node_modules/react-icons/lib/io/trash-a';
import { get } from 'lodash';

/**
 * Class for building the Editor ColorPicker elements
 *
 * @author jason.xie@victheme.com
 */
export default class ColorPicker extends React.Component {
    state = {
        displayColorPicker: false,
        value: '',
        color: {}
    };

    constructor(props) {
        super(props);
        if ('value' in props) {
            this.state.value = props.value;
        }
    };

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value !== this.state.value) {
            this.state.value = nextProps.value;
        }
        this.reset();
    }

    componentWillUnmount() {
        this.props.root.mutateSpace('left', null, null, true);
    }

    show = () => {
        const { props, state, change, isOpen } = this;
        const { config, root, uuid } = props;

        if (!isOpen()) {
            const chromeProps = config.get('elements.colorPicker.props.chrome', {
                color: state.color,
                onChange: change
            });

            root.mutateSpace('left', <ChromePicker { ...chromeProps } />, uuid);
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

    erase = () => {
        this.setState({
            value: ' ',
            color: {}
        });

        this.props.onChange({
            target: {
                name: this.props.name,
                value: ' '
            }
        });
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
        const { props, state, toggle, show, close, isOpen, erase } = this;
        const { config } = props;

        const mainProps = config.get('elements.colorPicker.props.main', {
            className: props.className + ' stylizer-color-element'
        });

        const inputProps = config.get('elements.colorPicker.props.input', {
            type: 'text',
            value: state.value,
            onChange: props.onChange,
            onFocus: show
        });

        const spanPickerConst = config.get('elements.colorPicker.props.spanPicker', {
            className: 'stylizer-color-preview',
            onClick: toggle
        });

        const spanPickerContentConst = config.get('elements.colorPicker.props.spanPickerContent', {
            style: {
                backgroundColor: state.value
            },
            className: 'stylizer-color-preview-content'
        });

        const spanCloserConst = config.get('elements.colorPicker.props.spanCloser', {
            className: 'stylizer-color-closer',
            onClick: close
        });

        const spanEraseConst = config.get('elements.colorPicker.props.spanEraser', {
            className: 'stylizer-color-closer',
            onClick: erase
        });

        const closeIconProps = config.get('elements.colorPicker.props.closeIcon', {
            size: 13
        });

        const trashIconProps = config.get('elements.colorPicker.props.trashIcon', {
            size: 13
        });

        return (
            <div { ...mainProps } >
                <span { ...spanPickerConst }><span { ...spanPickerContentConst } /></span>
                <input { ...inputProps } />
                { state.value && state.value !== ' ' && !isOpen() && <span { ...spanEraseConst }><TrashIcon { ...trashIconProps } /></span> }
                { isOpen() && <span { ...spanCloserConst } ><CloseIcon { ...closeIconProps } /></span> }
            </div>
        )
    }
}