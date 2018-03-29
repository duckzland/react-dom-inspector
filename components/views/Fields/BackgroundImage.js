import React from 'react';
import Configurator from '../../modules/Config';
import ImageIcon from '../../../node_modules/react-icons/lib/fa/file-image-o';
import GradientIcon from '../../../node_modules/react-icons/lib/fa/object-group';
import { get } from 'lodash';

/**
 * Class for building the Background Image elements
 *
 * @author jason.xie@victheme.com
 */
export default class BackgroundImage extends React.Component {
    
    state = {
        value: ''
    };
    
    config = false;

    constructor(props) {
        super(props);
        if ('value' in props) {
            this.state.value = props.value;
        }

        this.config = 'config' in props ? props.config : new Configurator();

        if ('root' in props) {
            this.state.root = props.root;
        }
    };

    render() {
        const { props, config } = this;
        const { root } = props;

        const mainProps = config.get('fields.backgroundImage.props.main', {
            className: props.className + ' stylizer-background-image-element'
        });

        const spanGradientPickerProps = config.get('fields.backgroundImage.props.gradientPicker', {
            className: 'stylizer-gradient-picker',
            onClick: () => { root.generateGradientFields && root.generateGradientFields(true);  }
        });

        const spanImagePickerProps = config.get('fields.backgroundImage.props.imagePicker', {
            className: 'stylizer-image-picker',
            onClick: () => { root.generateImageFields && root.generateImageFields(true); }
        });

        const gradientIconProps = config.get('fields.backgroundImage.props.gradientIcon', {
            size: 13
        });

        const imageIconProps = config.get('fields.backgroundImage.props.imageIcon', {
            size: 13
        });

        return (
            <div { ...mainProps } >
                <span { ...spanGradientPickerProps }><GradientIcon { ...gradientIconProps }/></span>
                <span { ...spanImagePickerProps }><ImageIcon { ...imageIconProps } /></span>
                <input { ...props } />
            </div>
        );
    }
}