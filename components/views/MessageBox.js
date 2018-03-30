import React from 'react';
import SuccessIcon from '../../node_modules/react-icons/lib/io/checkmark-circled.js';
import ErrorIcon from '../../node_modules/react-icons/lib/io/alert-circled.js';
import NoticeIcon from '../../node_modules/react-icons/lib/io/plus-circled.js';

/**
 * Class for generating the Message Box Element markup
 *
 * @author jason.xie@victheme.com
 */
export default class MessageBox extends React.Component {

    state = {
        message: false,
        duration: false,
        type: false,
        show: false
    };

    set = (type, message, duration) => {

        const { clear, props } = this;

        if (message.length > 0) {
            this.setState({
                type: type,
                message: message,
                duration: duration,
                show: true
            });

            duration && setTimeout(() => { clear() }, duration);
        }
        else {
            clear();
        }

        props.root.setState({ refresh: true });

    };

    clear = () => {
        this.setState({
            type: false,
            message: false,
            duration: false,
            show: false
        });
        this.props.root.setState({ refresh: true });
    };

    render() {

        const { state, props } = this;
        const { config } = props.root;
        const { show, type } = state;

        const messageBoxProps = config.get('message.props.element', {
            key: 'stylizer-message-box',
            className: [ 'stylizer-message-box', 'stylizer-message-box-' + type].join(' ')
        });

        const messageBoxIconProps = config.get('message.props.icon', {
            key: 'stylizer-message-box-icon',
            size: 16
        });

        const Icon = [];

        switch (type) {
            case 'notice' :
                Icon.push(
                    <NoticeIcon { ...messageBoxIconProps } />
                );
                break;

            case 'error' :
                Icon.push(
                    <ErrorIcon { ...messageBoxIconProps } />
                );
                break;

            case 'success' :
                Icon.push(
                    <SuccessIcon { ...messageBoxIconProps } />
                );
                break;
        }

        return (
            show && <div { ...messageBoxProps }>
                { Icon }
                <span>{ state.message }</span>
            </div>
        )
    };
}