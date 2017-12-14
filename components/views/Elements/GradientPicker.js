import React from 'react';
import { ChromePicker } from 'react-color';
import CloseIcon from '../../../node_modules/react-icons/lib/io/close-circled';
import { get, set, forEach, orderBy } from 'lodash';

/**
 * Class for building the Editor GradientPicker elements
 *
 * @author jason.xie@victheme.com
 */
export default class GradientPicker extends React.Component {
    state = {
        activeColorPicker: false,
        mode: 'linear',
        rotate: 0,
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
    config = {};

    handleElement = null;
    pickerElement = null;
    canvasElement = null;

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

    componentDidMount() {
        this.createGradient();
    }

    onChange = (e) => {

        switch  (e.target.name) {
            case 'gradient-mode' :
                this.state.mode = e.target.value;
                this.createGradient();
                break;

            case 'gradient-rotator' :
                this.state.rotate = e.target.value;
                this.createGradient();
                break;

            case 'gradient-stops-color' :
                break;

            case 'gradient-stops-delete' :
                break;
        }

        this.setState(this.state);
    };

    dragStart = (e) => {
        e.preventDefault();
        this.dragExit();
        this.state.node = e.target;
    };

    dragMove = (e) => {

        e.preventDefault();
        
        const { state, handleElement, createGradient } = this;
        const { node } = state;
        const { nativeEvent } = e;
        const oldVal = node ? get(state, 'stops.' + node.getAttribute('target') + '.position', false) : false;
        const percent = handleElement && nativeEvent ? Math.min(100, Math.max(0, Math.round((100 / handleElement.clientWidth)  * nativeEvent.offsetX))) : false;

        if (!node 
            || !handleElement 
            || !nativeEvent 
            || nativeEvent.offsetX < 0
            || nativeEvent.target === node 
            || oldVal === percent) {
            return false;
        }

        set(state, 'stops.' + node.getAttribute('target') + '.position', percent);
        createGradient();
        this.setState(state);
    };

    dragExit = () => {
        const { state } = this;
        state.node = false;
        state.stops = orderBy(state.stops, 'position', 'asc');
    };

    getStop = (delta) => {
        return get(this, 'state.stops.' + delta, false);
    };

    setStop = (delta, data) => {
        return set(this, 'state.stops.' + delta, data);
    };

    removeStop = (delta) => {
        const { getStop, state, createGradient } = this;

        if (getStop(delta)) {
            state.stops.splice(delta, 1);
            this.setState(state);
            createGradient();
        }
    };

    addStop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { state, handleElement } = this;
        const { nativeEvent } = e;
        const { originalTarget, layerX } = nativeEvent;

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

        let newStop = false;

        forEach(state.stops, (stop, delta) => {
            if (newStop !== false) {
                state.stops[newStop].color = stop.color;
                return false;
            }
            if (stop.color === 'needClosest') {
                newStop = delta;
            }
        });

        this.setState(state);
    };

    showPicker = (delta) => {
        const { props, state, config, changePicker, getPicker, getStop } = this;
        const data = getStop(delta);

        state.activeColorPicker = delta;

        if (getPicker()) {
            props.root.mutateSpace('left', null, null, true);
        }

        const chromeProps = get(config, 'ElementsGradientPickerChromeProps', {
            ref: (element) => { this.pickerElement = element },
            color: data.color ? data.color : '',
            onChange: changePicker
        });

        props.root.mutateSpace('left', <ChromePicker { ...chromeProps } />, props.uuid);
        this.setState(state);
    };

    closePicker = () => {
        this.props.root.mutateSpace('left', null, null, true);
        this.setState({ activeColorPicker: false })
    };

    getPicker = () => {
        return this.pickerElement;
    };

    changePicker = (color) => {
        const { state, convertPicker, setStop, getStop, createGradient } = this;
        const Stop = getStop(state.activeColorPicker);

        Stop.color = convertPicker(color);
        setStop(state.activeColorPicker, Stop);
        createGradient();
        this.setState(state);
    };

    togglePicker = (delta) => {
        const { getPicker, showPicker, closePicker } = this;
        getPicker() && delta === this.state.activeColorPicker ? closePicker() : showPicker(delta);
    };

    convertPicker = (color) => {
        if (color.rgb.a === 1 || color.rgb.a === 0) {
            return color.hex;
        }
        return 'rgba(' + color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b + ', ' + color.rgb.a + ')';
    };

    createGradient = () => {
        const { canvasElement, state } = this;

        if (!canvasElement) {
            return false;
        }

        const ctx = canvasElement.getContext('2d');
        const width = canvasElement.width;
        const height = canvasElement.height;
        let gradient = false;

        switch (state.mode) {
            case 'linear' :
                gradient = ctx.createLinearGradient(0, 0, width, 0);
                break;

            case 'radial' :
                gradient = ctx.createRadialGradient(0, 0, 0, width, 0, state.rotate);
                break;
        }

        if (gradient) {
            state.stops.map(function(data) {
                gradient.addColorStop(data.position / 100, data.color);
            });
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
    };

    render() {
        const { props, state, config, onChange, dragStart, dragExit, dragMove, togglePicker, addStop, removeStop } = this;
        const mainProps = get(config, 'ElementGradientPickerMainProps', {
            className: props.className + ' stylizer-gradient-element'
        });

        const canvasProps = get(config, 'ElementGradientPickerCanvasProps', {
            className: 'stylizer-gradient-canvas',
            ref: (element) => { this.canvasElement = element }
        });

        const rowProps = get(config, 'ElementGradientPickerModeLabelProps', {
            className: 'stylizer-form-row'
        });

        const modeLabelProps = get(config, 'ElementGradientPickerModeLabelProps', {
            className: 'stylizer-form-label'
        });

        const modeWrapperProps = get(config, 'ElementGradientPickerModeWrapperProps', {
            className: 'stylizer-form-input'
        });

        const modeElementProps = get(config, 'ElementGradientPickerModeElementProps', {
            className: 'stylizer-form-input',
            value: state.mode,
            name: 'gradient-mode',
            onChange: (e) => { onChange(e) }
        });

        const rotateWrapperProps = get(config, 'ElementGradientPickerRotateWrapperProps', {
            className: 'stylizer-form-input'
        });

        const rotateLabelProps = get(config, 'ElementGradientPickerRotateLabelProps', {
            className: 'stylizer-form-label'
        });

        const rotateElementProps = get(config, 'ElementGradientPickerRotateProps', {
            type: 'range',
            min: 0,
            max: 360,
            step: 1,
            className: 'stylizer-form-input',
            name: 'gradient-rotator',
            value: state.rotate,
            onChange: onChange
        });

        const handleElementProps = get(config, 'ElementGradientPickerHandleWrapperProps', {
            className: 'stylizer-gradient-handle-wrapper',
            ref: (element) => { this.handleElement = element },
            onMouseMove: dragMove,
            onMouseUp: dragExit,
            onMouseLeave: dragExit,
            onClick: (e) => { addStop(e) }
        });

        let Stops = [];
        forEach(state.stops, (stop, delta) => {
            const handleProps = get(config, 'ElementGradientPickerHandleProps', {
                className: 'stylizer-gradient-handle',
                target: delta,
                name: 'gradient-stops-drag',
                key: 'gradient-stops-' + delta,
                style: { left: stop.position + '%' },
                onMouseDown: dragStart,
                onMouseUp: dragExit
            });

            const handleCloserProps = get(config, 'ElementGradientPickerHandleCloserProps', {
                key: 'gradient-stops-closer',
                name: 'gradient-stops-delete',
                className: 'stylizer-gradient-handle-closer',
                target: delta,
                onClick: () => { removeStop(delta) }
            });

            const handleColorProps = get(config, 'ElementGradientPickerHandleColorProps', {
                key: 'gradient-stops-color',
                name: 'gradient-stops-color',
                className: 'stylizer-gradient-handle-color',
                target: delta,
                style: { backgroundColor: stop.color },
                onClick: () => togglePicker(delta)
            });

            Stops.push(
                <div { ...handleProps }>
                    { state.stops.length > 2 &&  <CloseIcon { ...handleCloserProps } /> }
                    <span { ...handleColorProps } />
                </div>
            );

        });

        return (
            <div { ...mainProps } >
                <canvas { ...canvasProps } />
                <div { ...handleElementProps }>
                    { Stops }
                </div>
                <div { ...rowProps }>
                    <div { ...modeWrapperProps }>
                        <label { ...modeLabelProps }>Mode</label>
                        <select { ...modeElementProps }>
                            <option key="linear-gradient" value="linear">Linear</option>
                            <option key="radial-gradient" value="radial">Radial</option>
                        </select>
                    </div>
                    <div { ...rotateWrapperProps }>
                        <label { ...rotateLabelProps }>Rotate</label>
                        <input { ...rotateElementProps } />
                    </div>
                </div>
            </div>
        )
    }
}