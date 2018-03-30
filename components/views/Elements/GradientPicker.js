import React from 'react';
import { ChromePicker } from 'react-color';
import CloseIcon from '../../../node_modules/react-icons/lib/io/close-circled';
import GradientParser from '../../modules/GradientParser';
import { get, set, forEach, orderBy } from 'lodash';

/**
 * Class for building the Editor GradientPicker elements
 *
 * @author jason.xie@victheme.com
 */
export default class GradientPicker extends React.Component {
    state = {
        activePicker: false,
        mode: 'linear',
        rotate: 0,
        shape: 'circle',
        position: '',
        size: '',
        repeat: 'none',
        stops: [
            {
                position: 0,
                color: '#000000'
            },
            {
                position: 100,
                color: '#ffffff'
            }
        ]
    };

    prefix = '';

    handleElement = null;
    pickerElement = null;
    previewElement = null;

    constructor(props) {
        super(props);

        const dom = document.createElement('div');

        if ('value' in props) {
            const Parsed = props.value ? (new GradientParser(props.value)) : false;
            Parsed && forEach(Parsed, (val, key) => {
                this.state[key] = val;
            });
        }

        ['-o-', '-ms-', '-moz-', '-webkit-', ''].map((prefix) => {
            dom.style.background = prefix + 'linear-gradient(#000000, #ffffff)';
            if (dom.style.background) {
                this.prefix = prefix;
            }
        });
    };

    componentDidMount() {
        this.onSubmit();
    };

    onChange = (e) => {
        const { state, onSubmit } = this;
        state[e.target.name] = e.target.value;
        onSubmit();
        this.setState(state);
    };

    onDragStart = (e) => {
        const { state, onDragExit } = this;
        e.preventDefault();
        onDragExit();
        state.node = e.target;
    };

    onDragMove = (e) => {

        e.preventDefault();
        
        const { state, handleElement, onSubmit } = this;
        const { node } = state;
        const { nativeEvent } = e;

        const oldVal = node
                ? get(state, 'stops.' + node.getAttribute('target') + '.position', false)
                : false;

        const percent = (handleElement && nativeEvent && handleElement.clientWidth && nativeEvent.offsetX)
                ? Math.min(100, Math.max(0, Math.round((100 / handleElement.clientWidth)  * nativeEvent.offsetX)))
                : false;

        if (!node 
            || !handleElement 
            || !nativeEvent
            || nativeEvent.offsetX < 0
            || nativeEvent.target === node 
            || oldVal === percent) {
            return false;
        }

        set(state, 'stops.' + node.getAttribute('target') + '.position', percent);
        onSubmit();

        this.setState(state);
    };

    onDragExit = (e) => {
        const { state } = this;
        state.node = false;
        state.stops = orderBy(state.stops, 'position', 'asc');
    };

    onKeypress = (e) => {
        const maybeNumber = e.target.value.match(/-?\d*(\d+)/g);
        const { onChange } = this;

        if (maybeNumber && maybeNumber[0]) {

            const oldValue = maybeNumber[0];
            let newNumber = parseFloat(maybeNumber[0]);
            switch (e.key) {
                case 'ArrowUp':
                    newNumber++;
                    break;
                case 'ArrowDown':
                    newNumber--;
                    break;
            }

            e.target.value = e.target.value.replace(oldValue, newNumber);
            onChange(e);
        }
    };

    onAddStop = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const { state, handleElement, onSubmit } = this;
        const { nativeEvent } = e;
        const { originalTarget, layerX } = nativeEvent;

        let newStop = false;

        if (!originalTarget
            || !nativeEvent
            || !handleElement
            || handleElement !== originalTarget) {
            return false;
        }

        state.stops.push({
            position: Math.ceil((layerX / handleElement.clientWidth) * 100),
            color: 'needClosest'
        });

        state.stops = orderBy(state.stops, 'position', 'asc');

        forEach(state.stops, (stop, delta) => {
            if (stop.color === 'needClosest') {
                newStop = delta;
                return false;
            }
        });

        if (newStop !== false) {
            if (state.stops[newStop + 1]) {
                state.stops[newStop].color = state.stops[newStop + 1].color;
            }
            else if (state.stops[newStop - 1]) {
                state.stops[newStop].color = state.stops[newStop - 1].color;
            }
            else {
                state.stops[newStop].color = '#ffffff';
            }
        }

        this.setState(state);
        onSubmit();
    };

    onSubmit = () => {
        const { previewElement, state, prefix, props } = this;
        const rules = [];
        const context = [];
        const repeating = state.repeat === 'repeat';

        if (!previewElement) {
            return false;
        }

        let rule = '';
        switch (state.mode) {
            case 'linear' :
                rules.push(state.rotate + 'deg');
                state.stops.map((data) => {
                    rules.push(data.color + ' ' + data.position + '%');
                });

                rule = prefix + (repeating ? 'repeating-linear-gradient' : 'linear-gradient') + '(' + rules.join(', ') + ');';
                break;

            case 'radial' :
                state.shape && state.shape !== 'custom-size' && context.push(state.shape);
                state.size && state.shape === 'custom-size' && context.push(state.size);
                state.position && context.push('at ' + state.position);

                context.length && rules.push(context.join(' '));

                state.stops.map((data) => {
                    rules.push(data.color + ' ' + data.position + '%');
                });

                rule = prefix + (repeating ? 'repeating-radial-gradient' : 'radial-gradient') + '(' + rules.join(', ') + ');';
                break;
        }

        previewElement.setAttribute('style', 'background-image:' + rule);
        props.onChange && props.onChange({
            target: {
                skipValidation: true,
                name: 'background-image',
                value: rule
            }
        });
    };

    onRemoveStop = (delta) => {
        const { state, onSubmit } = this;
        if (get(state, 'stops.' + delta, false)) {
            state.stops.splice(delta, 1);
            this.setState(state);
            onSubmit();
        }
    };

    onTogglePicker = (delta) => {
        const { props, state, onChangePicker, pickerElement } = this;
        const { config, root, uuid } = props;
        const data = get(state, 'stops.' + delta, false);

        root.mutateSpace('left', null, null, true);

        if (pickerElement && delta === state.activePicker) {
            state.activePicker = false;
        }
        else {
            state.activePicker = delta;
            const chromeProps = config.get('elements.gradientPicker.props.chrome', {
                ref: (element) => { this.pickerElement = element },
                color: data.color ? data.color : '',
                onChange: onChangePicker
            });

            root.mutateSpace('left', <ChromePicker { ...chromeProps } />, uuid);
        }

        this.setState(state);
    };

    onChangePicker = (color) => {
        const { state, onSubmit } = this;
        const Stop = get(state, 'stops.' + state.activePicker, false);

        if (Stop) {
            Stop.color = (color.rgb.a === 1 || color.rgb.a === 0)
                ? color.hex
                : 'rgba(' + color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b + ', ' + color.rgb.a + ')';

            set(this, 'state.stops.' + state.activePicker, Stop);
            onSubmit();
            this.setState(state);
        }
    };

    render() {
        const { props, state, onChange, onKeypress, onDragStart, onDragExit, onDragMove, onTogglePicker, onAddStop, onRemoveStop } = this;
        const { config } = props;
        const { polyglot } = props.mainRoot;

        const mainProps = config.get('elements.gradientPicker.props.main', {
            className: props.className + ' stylizer-gradient-element'
        });

        const previewProps = config.get('elements.gradientPicker.props.canvas', {
            className: 'stylizer-gradient-canvas',
            ref: (element) => { this.previewElement = element }
        });

        const rowProps = config.get('elements.gradientPicker.props.modeLabel', {
            className: 'stylizer-form-row'
        });

        const labelProps = config.get('elements.gradientPicker.props.label', {
            className: 'stylizer-form-label'
        });

        const wrapperProps = config.get('elements.gradientPicker.props.wrapper', {
            className: 'stylizer-form-item'
        });

        const repeatElementProps = config.get('elements.gradientPicker.props.repeat', {
            className: 'stylizer-form-input',
            value: state.repeat,
            name: 'repeat',
            onChange: onChange
        });

        const modeElementProps = config.get('elements.gradientPicker.props.mode', {
            className: 'stylizer-form-input',
            value: state.mode,
            name: 'mode',
            onChange: onChange
        });

        const rotateElementProps = config.get('elements.gradientPicker.props.rotate', {
            type: 'text',
            className: 'stylizer-form-input',
            name: 'rotate',
            value: state.rotate,
            onKeyDown: onKeypress,
            onChange: onChange
        });

        const shapeElementProps = config.get('elements.gradientPicker.props.shape', {
            className: 'stylizer-form-input',
            name: 'shape',
            value: state.shape,
            onChange: onChange
        });

        const sizeElementProps = config.get('elements.gradientPicker.props.size', {
            type: 'text',
            className: 'stylizer-form-input',
            name: 'size',
            value: state.size,
            onChange: onChange
        });

        const positionElementProps = config.get('elements.gradientPicker.props.offset', {
            type: 'text',
            className: 'stylizer-form-input',
            name: 'position',
            value: state.position,
            onChange: onChange
        });

        const handleElementProps = config.get('elements.gradientPicker.props.handleElement', {
            className: 'stylizer-gradient-handle-wrapper',
            ref: (element) => { this.handleElement = element },
            onMouseMove: onDragMove,
            onMouseUp: onDragExit,
            onMouseLeave: onDragExit,
            onClick: onAddStop
        });

        let Stops = [];
        forEach(state.stops, (stop, delta) => {
            const handleProps = config.get('elements.gradientPicker.props.handle', {
                className: 'stylizer-gradient-handle',
                target: delta,
                name: 'gradient-stops-drag',
                key: 'gradient-stops-' + delta,
                style: { left: stop.position + '%' },
                onMouseDown: onDragStart,
                onMouseUp: onDragExit
            });

            const handleCloserProps = config.get('elements.gradientPicker.props.handleCloser', {
                key: 'gradient-stops-closer',
                name: 'gradient-stops-delete',
                className: 'stylizer-gradient-handle-closer',
                onClick: () => { onRemoveStop(delta) }
            });

            const handleColorProps = config.get('elements.gradientPicker.props.handleColor', {
                key: 'gradient-stops-color',
                name: 'gradient-stops-color',
                className: 'stylizer-gradient-handle-color',
                style: { backgroundColor: stop.color },
                onClick: () => { onTogglePicker(delta) }
            });

            Stops.push(
                <div { ...handleProps }>
                    { state.stops.length > 2 &&  <CloseIcon { ...handleCloserProps } /> }
                    <span { ...handleColorProps } />
                </div>
            );
        });

        return (
            <div { ...mainProps }>
                <div { ...previewProps } />
                <div { ...handleElementProps }>
                    { Stops }
                </div>
                <div { ...rowProps }>
                    <div { ...wrapperProps }>
                        <label { ...labelProps }>{ polyglot.t('Repeat') }</label>
                        <select { ...repeatElementProps }>
                            <option key="gradient-norepeat" value="none">{ polyglot.t('No Repeat') }</option>
                            <option key="gradient-repeat" value="repeat">{ polyglot.t('Repeat') }</option>
                        </select>
                    </div>
                    <div { ...wrapperProps }>
                        <label { ...labelProps }>{ polyglot.t('Mode') }</label>
                        <select { ...modeElementProps }>
                            <option key="gradient-linear" value="linear">{ polyglot.t('Linear') }</option>
                            <option key="gradient-radial" value="radial">{ polyglot.t('Radial') }</option>
                        </select>
                    </div>

                    { state.mode === 'linear'
                        && <div { ...wrapperProps }>
                            <label { ...labelProps }>{ polyglot.t('Angle') }</label>
                            <input { ...rotateElementProps } />
                        </div> }

                    { state.mode === 'radial'
                        && <div { ...wrapperProps }>
                            <label { ...labelProps }>{ polyglot.t('Shape') }</label>
                            <select { ...shapeElementProps }>
                                <option key="radial-circle" value="circle">{ polyglot.t('Circle') }</option>
                                <option key="radial-eclipse" value="ellipse">{ polyglot.t('Ellipse') }</option>
                                <option key="radial-closest-side" value="closest-side">{ polyglot.t('Closest Side') }</option>
                                <option key="radial-closest-corner" value="closest-corner">{ polyglot.t('Closest Corner') }</option>
                                <option key="radial-farthest-side" value="farthest-side">{ polyglot.t('Farthest Side') }</option>
                                <option key="radial-farthest-corner" value="farthest-corner">{ polyglot.t('Farthest Corner') }</option>
                                <option key="radial-custom-size" value="custom-size">{ polyglot.t('Custom Size') }</option>
                            </select>
                        </div> }

                    { state.mode === 'radial'
                        && state.shape === 'custom-size'
                        && <div { ...wrapperProps }>
                            <label { ...labelProps }>{ polyglot.t('Custom Size') }</label>
                            <input { ...sizeElementProps } />
                        </div> }

                    { state.mode === 'radial'
                        && <div { ...wrapperProps }>
                            <label { ...labelProps }>{ polyglot.t('Position') }</label>
                            <input { ...positionElementProps } />
                        </div> }
                </div>
            </div>
        )
    }
}