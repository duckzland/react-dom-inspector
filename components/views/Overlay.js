import React from 'react';

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
        const { props } = this;
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
            result[item] = parseFloat(computedStyle[item].match(/\d+/)) || 0;
        });

        // Set the size
        Object.assign(result, {
            width: node.offsetWidth - result['border-left-width'] - result['border-right-width'] - result['padding-left'] - result['padding-right'],
            height: node.offsetHeight - result['border-top-width'] - result['border-bottom-width'] - result['padding-top'] - result['padding-bottom']
        });

        // Define the node sizing
        let _x = node.getBoundingClientRect().left - parseFloat(computedStyle['margin-left'].match(/\d+/));
        let _y = node.getBoundingClientRect().top - parseFloat(computedStyle['margin-top'].match(/\d+/));
        let el = node.parent;

        // Get the parent nodes sizing
        while (el) {
            computedStyle = getComputedStyle(el);
            _x += el.frameElement.getBoundingClientRect().left - parseFloat(computedStyle['margin-left'].match(/\d+/));
            _y += el.frameElement.getBoundingClientRect().top - parseFloat(computedStyle['margin-top'].match(/\d+/));
            el = el.parent;
        }

        // mainBody
        _x += parseFloat(mainBodyStyle['padding-left'].match(/\d+/));
        _y += parseFloat(mainBodyStyle['padding-top'].match(/\d+/));

        // frameStyle
        _x += props.frame.offsetLeft;
        _y += parseFloat(frameStyle['margin-top'].match(/\d+/));

        // frameWrapper
        _x += props.wrapper.offsetLeft;
        _y += parseFloat(frameWrapperStyle['margin-top'].match(/\d+/)) + parseFloat(frameWrapperStyle['border-top-width'].match(/\d+/));

        // In case Frame parent is not the frameWrapper
        if (frameParentStyle) {
            _x += props.frame.parentNode.offsetLeft;
            _y += parseFloat(frameParentStyle['margin-top'].match(/\d+/)) + parseFloat(frameParentStyle['border-top-width'].match(/\d+/));
            _y -= props.frame.parentNode.scrollTop;
        }

        // Adjust the scrolled value
        _y -= props.wrapper.parentElement.scrollTop;
        _y -= props.wrapper.scrollTop;

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