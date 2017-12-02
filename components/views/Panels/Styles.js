import BasePanel from '../Panel';

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
            values: {}
        };

        this.config = {
            type: 'styles',
            empty: null
        };
        this.fields = [
            {
                key: 'background',
                title: 'Background',
                type: 'group',
                elements: [
                    {title: 'color', target: 'background-color', type: 'element', field: 'color', default: '', inline: false},
                    {title: 'image', target: 'background-image', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'position', target: 'background-position', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'size', target: 'background-size', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'repeat', target: 'background-repeat', type: 'element', field: 'select', options: {
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
            }
        ];
        this.initialize(props);
    }
}