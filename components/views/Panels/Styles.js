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

        props.config.insert({
            type: 'styles',
            empty: null
        });

        const { polyglot } = props.mainRoot;

        this.defaultFields = [
            {
                key: 'background',
                title: polyglot.t('Background'),
                type: 'group',
                elements:  [
                    { title: polyglot.t('color'), target: 'background-color', type: 'element', field: 'color', default: '', inline: false},
                    { title: polyglot.t('image'), target: 'background-image', type: 'element', field: 'background-image', default: '', inline: false},
                    { title: polyglot.t('position'), target: 'background-position', type: 'element', field: 'text', default: '', inline: false},
                    { title: polyglot.t('size'), target: 'background-size', type: 'element', field: 'text', default: '', inline: false},
                    { title: polyglot.t('repeat'), target: 'background-repeat', type: 'element', field: 'select', options: {
                        initial: polyglot.t('None'),
                        repeat : polyglot.t('Repeat All'),
                        'repeat-x' : polyglot.t('Horizontally'),
                        'repeat-y' : polyglot.t('Vertically'),
                        'no-repeat': polyglot.t('Don\'t Repeat')
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'advanced',
                title: polyglot.t('Background Adjustment'),
                type: 'group',
                elements: [
                    {title: polyglot.t('attachment'), target: 'background-attachment', type: 'element', field: 'select', options: {
                        scroll: polyglot.t('Scroll'),
                        fixed: polyglot.t('Fixed'),
                        local: polyglot.t('Local')
                    }, default: '', inline: false},
                    {title: polyglot.t('clip'), target: 'background-clip', type: 'element', field: 'select', options: {
                        'border-box': polyglot.t('Border Box'),
                        'padding-box': polyglot.t('Padding Box'),
                        'content-box': polyglot.t('Content Box')
                    }, default: '', inline: false},

                    {title: polyglot.t('origin'), target: 'background-origin', type: 'element', field: 'select', options: {
                        'padding-box': polyglot.t('Padding Box'),
                        'border-box': polyglot.t('Border Box'),
                        'content-box': polyglot.t('Content Box')
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'visibility',
                title: polyglot.t('Visibility'),
                type: 'group',
                elements: [
                    {title: polyglot.t('opacity'), target: 'opacity', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('display'), target: 'display', type: 'element', field: 'text', default: '', inline: false},

                    {title: polyglot.t('visibility'), target: 'visibility', type: 'element', field: 'select', options: {
                        visible: polyglot.t('Visible'),
                        hidden: polyglot.t('Hidden'),
                        collapse: polyglot.t('Collapse'),
                        initial: polyglot.t('Initial'),
                        inherit: polyglot.t('Inherit')
                    }, default: '', inline: false},

                    {title: polyglot.t('overflow'), target: 'overflow', type: 'element', field: 'select', options: {
                        visible: polyglot.t('Visible'),
                        hidden: polyglot.t('Hidden'),
                        scroll: polyglot.t('Scroll'),
                        auto: polyglot.t('Auto'),
                        initial: polyglot.t('Initial'),
                        inherit: polyglot.t('Inherit')
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'box-shadow',
                title: polyglot.t('Box Shadow'),
                type: 'group',
                elements:  [
                    { title: false, target: 'box-shadow', type: 'element', field: 'box-shadow', default: '', inline: false}
                ]
            }
        ];

        this.gradientPickerFields = [{
            key: 'background',
            title: polyglot.t('Create Gradient'),
            type: 'group',
            toggle: 'off',
            elements:  [{ title: false, target: 'background-image', type: 'element', field: 'gradient', default: '', inline: false}]
        }];

        this.imagePickerFields = [{
            key: 'background',
            title: polyglot.t('Select Image'),
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