import React from 'react';
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

    render() {
        const { props, config } = this;
        const { root } = props;

        const mainProps = get(config, 'ElementBackgroundImageMainProps', {
            className: props.className + ' stylizer-background-image-element'
        });

        const spanGradientPickerConst = get(config, 'ElementBackgroundImageSpanGradientPickerConst', {
            className: 'stylizer-gradient-picker',
            onClick: () => { root.generateGradientFields && root.generateGradientFields(true);  }
        });

        const spanImagePickerConst = get(config, 'ElementBackgroundImageSpanImagePickerConst', {
            className: 'stylizer-image-picker',
            onClick: () => { root.generateImageFields && root.generateImageFields(true); }
        });

        const gradientIconProps = get(config, 'ElementBackgroundImageGradientIconProps', {
            size: 13
        });

        const imageIconProps = get(config, 'ElementBackgroundImageImageIconProps', {
            size: 13
        });

        return (
            <div { ...mainProps } >
                <span { ...spanGradientPickerConst }><GradientIcon { ...gradientIconProps }/></span>
                <span { ...spanImagePickerConst }><ImageIcon { ...imageIconProps } /></span>
                <input { ...props } />
            </div>
        );
    }
}