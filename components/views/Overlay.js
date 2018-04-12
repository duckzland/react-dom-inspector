import React from 'react';
import { isNaN } from 'lodash';

/**
 * Component for building an overlay for hovered DOM Element
 *
 * @author jason.xie@victheme.com
 */
export default class Overlay extends React.Component {

    state = {
        position: {
            top: 0,
            left: 0,
            zIndex: 0
        },
        size: {
            width: 0,
            height: 0
        },
        border: {
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0
        },
        padding: {
            paddingLeft : 0,
            paddingRight : 0,
            paddingTop : 0,
            paddingBottom : 0
        },
        margin: {
            marginLeft : 0,
            marginRight: 0,
            marginTop : 0,
            marginBottom : 0
        }
    };

    detectSize = (node) => {
        const { props, convertNumeric } = this;
        const result = {};
        const requiredValue = [
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'z-index'
        ];

        this.document = node.ownerDocument;

        let mainBodyStyle = getComputedStyle(document.body);
        let computedStyle = getComputedStyle(node);
        let frameStyle = getComputedStyle(props.frame);
        let frameWrapperStyle = getComputedStyle(props.wrapper);
        let frameParentStyle = props.wrapper !== props.frame.parentNode ? getComputedStyle(props.frame.parentNode) : false;

        requiredValue.forEach(item => {
            result[item] = convertNumeric(computedStyle[item]);
        });

        let _width = convertNumeric(node.offsetWidth);
            _width -= convertNumeric(result['border-left-width']);
            _width -= convertNumeric(result['border-right-width']);
            _width -= convertNumeric(result['padding-left']);
            _width -= convertNumeric(result['padding-right']);

        let _height = convertNumeric(node.offsetHeight);
            _height -= convertNumeric(result['border-top-width']);
            _height -= convertNumeric(result['border-bottom-width']);
            _height -= convertNumeric(result['padding-top']);
            _height -= convertNumeric(result['padding-bottom']);

        // Set the size
        Object.assign(result, {
            width: _width,
            height: _height
        });

        // Define the node sizing
        let _x = (convertNumeric(node.getBoundingClientRect().left) - convertNumeric(computedStyle['margin-left']));
        let _y = (convertNumeric(node.getBoundingClientRect().top) - convertNumeric(computedStyle['margin-top']));
        let el = node.parent;

        // Get the parent nodes sizing
        while (el) {
            computedStyle = getComputedStyle(el);
            _x += (convertNumeric(el.frameElement.getBoundingClientRect().left) - convertNumeric(computedStyle['margin-left']));
            _y += (convertNumeric(el.frameElement.getBoundingClientRect().top) - convertNumeric(computedStyle['margin-top']));
            el = el.parent;
        }

        // mainBody
        _x += convertNumeric(mainBodyStyle['padding-left']);
        _y += convertNumeric(mainBodyStyle['padding-top']);

        // frameStyle
        _x += convertNumeric(props.frame.offsetLeft);
        _y += convertNumeric(frameStyle['margin-top']);
        _y += convertNumeric(frameStyle['border-top-width']);
        _y += convertNumeric(frameStyle['top']);

        // frameWrapper
        _x += convertNumeric(props.wrapper.offsetLeft);
        _y += convertNumeric(frameWrapperStyle['margin-top']);
        _y += convertNumeric(frameWrapperStyle['border-top-width']);
        _y += convertNumeric(frameWrapperStyle['top']);

        // In case Frame parent is not the frameWrapper
        if (frameParentStyle) {
            _x += convertNumeric(props.frame.parentNode.offsetLeft);
            _y += convertNumeric(frameParentStyle['margin-top']);
            _y += convertNumeric(frameParentStyle['border-top-width']);
            _y += convertNumeric(frameParentStyle['top']);
            _y -= convertNumeric(props.frame.parentNode.scrollTop);
        }

        // Adjust the scrolled value
        _y -= convertNumeric(props.wrapper.parentElement.scrollTop);
        _y -= convertNumeric(props.wrapper.scrollTop);

        Object.assign(result, {
            top: _y,
            left: _x
        });

        this.setState({
            position: {
                top: result['top'],
                left: result['left'],
                zIndex: result['z-index']
            },
            size: {
                width: result['width'],
                height: result['height']
            },
            border: {
                borderLeftWidth: result['border-left-width'],
                borderRightWidth: result['border-right-width'],
                borderTopWidth: result['border-top-width'],
                borderBottomWidth: result['border-bottom-width']
            },
            padding: {
                paddingLeft : result['padding-left'],
                paddingRight : result['padding-right'],
                paddingTop : result['padding-top'],
                paddingBottom : result['padding-bottom']
            },
            margin: {
                marginLeft : result['margin-left'],
                marginRight: result['margin-rignt'],
                marginTop : result['margin-top'],
                marginBottom : result['margin-bottom']
            }
        });

        return result;
    };

    componentWillReceiveProps(props) {
        if ('node' in props && props.node && 'ownerDocument' in props.node) {
            this.detectSize(props.node);
        }
        else {
            this.resetState();
        }
    };

    convertNumeric(value) {
        const converted = parseFloat(value);
        return !isNaN(converted) ? converted : 0;
    };

    resetState = () => {
        this.setState({
            position: {
                top: 0,
                left: 0,
                zIndex: 0
            },
            size: {
                width: 0,
                height: 0
            },
            border: {
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0
            },
            padding: {
                paddingLeft : 0,
                paddingRight : 0,
                paddingTop : 0,
                paddingBottom : 0
            },
            margin: {
                marginLeft : 0,
                marginRight: 0,
                marginTop : 0,
                marginBottom : 0
            }
        });
    };

    render() {

        const { state, props } = this;
        const { config } = props;
        
        const overlayBoxProps = config.get('overlay.props.box', {
            key: 'overlay-box',
            className: 'stylizer-overlay-box',
            style: state.position
        });

        const overlayMarginProps = config.get('overlay.props.margin', {
            key: 'overlay-margin',
            className: 'stylizer-overlay-margin',
            style: state.margin
        });

        const overlayPaddingProps = config.get('overlay.props.padding', {
            key: 'overlay-padding',
            className: 'stylizer-overlay-padding',
            style: Object.assign({}, state.padding, state.border)
        });

        const overlayContentProps = config.get('overlay.props.content', {
            key: 'overlay-content',
            className: 'stylizer-overlay-content',
            style: state.size
        });

        return (
            <div { ...overlayBoxProps } >
                <div { ...overlayMarginProps }>
                    <div { ...overlayPaddingProps }>
                        <div { ...overlayContentProps }>
                            { null }
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}