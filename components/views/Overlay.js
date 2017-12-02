import React from 'react';
import { get } from 'lodash';

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

    config = {};

    detectSize = (node) => {
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

        let computedStyle = getComputedStyle(node);
        requiredValue.forEach(item => {
            result[item] = parseFloat(computedStyle[item]) || 0;
        });

        Object.assign(result, {
            width: node.offsetWidth - result['border-left-width'] - result['border-right-width'] - result['padding-left'] - result['padding-right'],
            height: node.offsetHeight - result['border-top-width'] - result['border-bottom-width'] - result['padding-top'] - result['padding-bottom']
        });

        let _x = node.getBoundingClientRect().left - parseFloat(computedStyle['margin-left']);
        let _y = node.getBoundingClientRect().top - parseFloat(computedStyle['margin-top']);
        let el = node.parent;
        while (el) {
            computedStyle = getComputedStyle(el);
            _x += el.frameElement.getBoundingClientRect().left - parseFloat(computedStyle['margin-left']);
            _y += el.frameElement.getBoundingClientRect().top - parseFloat(computedStyle['margin-top']);
            el = el.parent;
        }

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
        if ('node' in props && props.node && props.node instanceof HTMLElement) {
            this.detectSize(props.node);
        }
        else {
            this.resetState();
        }
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

        const { state, config } = this;
        const overlayBoxProps = get(config, 'overlayBoxProps', {
            key: 'overlay-box',
            className: 'stylizer-overlay-box',
            style: state.position
        });

        const overlayMarginProps = get(config, 'overlayMarginProps', {
            key: 'overlay-margin',
            className: 'stylizer-overlay-margin',
            style: state.margin
        });

        const overlayPaddingProps = get(config, 'overlayPaddingProps', {
            key: 'overlay-padding',
            className: 'stylizer-overlay-padding',
            style: Object.assign({}, state.padding, state.border)
        });

        const overlayContentProps = get(config, 'overlayContentProps', {
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