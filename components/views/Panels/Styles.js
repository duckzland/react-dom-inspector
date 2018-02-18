import React from 'react';
import BasePanel from '../Panel';
import CloseIcon from '../../../node_modules/react-icons/lib/io/close-circled';
import BackgroundImage from '../Fields/BackgroundImage';
import BoxShadow from '../Fields/BoxShadow';
import { get, forEach } from 'lodash';

/**
 * Class for generating the sytles panel inside the editor markup
 * This class is extending the BasePanel class
 *
 * @author jason.xie@victheme.com
 */
export default class Styles extends BasePanel {

    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {},
            picker: false
        };

        this.config.insert({
            type: 'styles',
            empty: null
        });

        this.defaultFields = [
            {
                key: 'background',
                title: 'Background',
                type: 'group',
                elements:  [
                    { title: 'color', target: 'background-color', type: 'element', field: 'color', default: '', inline: false},
                    { title: 'image', target: 'background-image', type: 'element', field: 'background-image', default: '', inline: false},
                    { title: 'position', target: 'background-position', type: 'element', field: 'text', default: '', inline: false},
                    { title: 'size', target: 'background-size', type: 'element', field: 'text', default: '', inline: false},
                    { title: 'repeat', target: 'background-repeat', type: 'element', field: 'select', options: {
                        initial: 'None',
                        repeat : 'Repeat All',
                        'repeat-x' : 'Horizontally',
                        'repeat-y' : 'Vertically',
                        'no-repeat': 'Don\'t Repeat'
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'advanced',
                title: 'Background Adjustment',
                type: 'group',
                elements: [
                    {title: 'attachment', target: 'background-attachment', type: 'element', field: 'select', options: {
                        scroll: 'Scroll',
                        fixed: 'Fixed',
                        local: 'Local'
                    }, default: '', inline: false},
                    {title: 'clip', target: 'background-clip', type: 'element', field: 'select', options: {
                        'border-box': 'Border Box',
                        'padding-box': 'Padding Box',
                        'content-box': 'Content Box'
                    }, default: '', inline: false},

                    {title: 'origin', target: 'background-origin', type: 'element', field: 'select', options: {
                        'padding-box': 'Padding Box',
                        'border-box': 'Border Box',
                        'content-box': 'Content Box'
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'visibility',
                title: 'Visibility',
                type: 'group',
                elements: [
                    {title: 'opacity', target: 'opacity', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'display', target: 'display', type: 'element', field: 'text', default: '', inline: false},

                    {title: 'visibility', target: 'visibility', type: 'element', field: 'select', options: {
                        visible: 'Visible',
                        hidden: 'Hidden',
                        collapse: 'Collapse',
                        initial: 'Initial',
                        inherit: 'Inherit'
                    }, default: '', inline: false},

                    {title: 'overflow', target: 'overflow', type: 'element', field: 'select', options: {
                        visible: 'Visible',
                        hidden: 'Hidden',
                        scroll: 'Scroll',
                        auto: 'Auto',
                        initial: 'Initial',
                        inherit: 'Inherit'
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'box-shadow',
                title: 'Box Shadow',
                type: 'group',
                elements:  [
                    { title: false, target: 'box-shadow', type: 'element', field: 'box-shadow', default: '', inline: false}
                ]
            }
        ];

        this.gradientPickerFields = [{
            key: 'background',
            title: 'Create Gradient',
            type: 'group',
            toggle: 'off',
            elements:  [{ title: false, target: 'background-image', type: 'element', field: 'gradient', default: '', inline: false}]
        }];

        this.imagePickerFields = [{
            key: 'background',
            title: 'Select Image',
            type: 'group',
            toggle: 'off',
            elements:  [{ title: false, target: 'background-image', type: 'element', field: 'image', default: '', inline: false}]
        }];

        this.generateBackgroundFields(false);

        this.initialize(props);
    }

    generateToggle = (element) => {
        const { onToggleLock, state } = this;
        this.toggleOpenIcon = false;
        this.toggleCloseIcon = state.picker ? (<CloseIcon size={ 16 } onClick={ () => onToggleLock(element) }/>) : null;
    };

    generateBackgroundFields = (refresh = false) => {
        this.fields = this.defaultFields;
        refresh && this.setState({ picker: false });
    };

    generateGradientFields = (refresh = false) => {
        this.fields = this.gradientPickerFields;
        refresh && this.setState({ picker: 'gradient' });
    };

    generateImageFields = (refresh = false) => {
        this.fields = this.imagePickerFields;
        refresh && this.setState({ picker: 'image' });
    };

    onToggleLock = (element) => {
        this.mutateSpace('left', null, null, true);
        this.generateBackgroundFields(true);
        this.setState({ picker: false });
    };

    hookBeforeElementRender = (element, inputElement, inputProps) => {
        if (element.field === 'background-image') {
            inputProps.type = 'text';
            inputElement.push( <BackgroundImage { ...inputProps} /> );
        }

        if (element.field === 'box-shadow') {
            inputProps.type = 'text';
            inputElement.push( <BoxShadow { ...inputProps} /> );
        }
    };
}