import React from 'react';
import { get } from 'lodash';
import Configurator from '../modules/Config';
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
        show: false,
        root: false
    };

    config = false;

    constructor(props) {
        super(props);
        this.config = 'config' in props ? props.config : new Configurator();

        if ('root' in props) {
            this.state.root = props.root;
        }
    };

    set = (type, message, duration) => {
        if (message.length > 0) {
            this.setState({
                type: type,
                message: message,
                duration: duration,
                show: true
            });

            if (duration) {
                setTimeout(() => { this.clear();}, duration);
            }
        }
        else {
            this.clear();
        }

        this.state.root.setState({refresh: true});

    };


    clear = () => {
        this.setState({
            type: false,
            message: false,
            duration: false,
            show: false
        });
        this.state.root.setState({refresh: true});
    };

    render() {

        const { state, config } = this;
        const messageBoxProps = config.get('message.props.element', {
            key: 'stylizer-message-box',
            className: [ 'stylizer-message-box', 'stylizer-message-box-' + state.type].join(' ')
        });

        const messageBoxIconProps = config.get('message.props.icon', {
            key: 'stylizer-message-box-icon',
            size: 16
        });

        const Icon = [];

        switch (state.type) {
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
            state.show && <div { ...messageBoxProps }>
                { Icon }
                <span>{ state.message }</span>
            </div>
        )
    };
}