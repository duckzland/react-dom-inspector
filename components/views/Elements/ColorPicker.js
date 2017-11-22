import React from 'react';
import { ChromePicker } from 'react-color';
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
    }

    show = () => {
        const { props, state, config, change } = this;
        if (!state.displayColorPicker) {
            const chromeProps = get(config, 'chromeProps', {
                color: state.color,
                onChange: change
            });

            props.root.mutateSpace('left', <ChromePicker { ...chromeProps } />, props.uuid);
        }
        this.setState({ displayColorPicker: !state.displayColorPicker })
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

    convert = (color) => {
        if (color.rgb.a === 1 || color.rgb.a === 0) {
            return color.hex;
        }
        return 'rgba(' + color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b + ', ' + color.rgb.a + ')';
    };

    render() {
        const { props, state, config, close, show } = this;
        const mainProps = {
            className: props.className
        };

        const inputProps = get(config, 'inputProps', {
            type: 'text',
            value: state.value,
            onChange: props.onChange,
            onFocus: show,
            onBlur: close
        });

        return (
            <div { ...mainProps } >
                <input { ...inputProps } />
            </div>
        )
    }
}

export default ColorPicker;