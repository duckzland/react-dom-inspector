import BasePanel from '../Panel';

/**
 * Class for generating the spacing panel inside the editor markup
 * This class is extending the BasePanel class
 *
 * @author jason.xie@victheme.com
 */
export default class Spacing extends BasePanel {
    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {}
        };

        this.config.insert({
            type: 'spacing',
            empty: null
        });

        this.fields = [
            {
                key: 'width',
                title: 'Width',
                type: 'group',
                elements: [
                    {title: 'Min Width', target: 'min-width', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Width', target: 'width', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Max Width', target: 'max-width', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'height',
                title: 'Height',
                type: 'group',
                elements: [
                    {title: 'Min Height', target: 'min-height', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Height', target: 'height', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Max Height', target: 'max-height', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'padding',
                title: 'Padding',
                type: 'group',
                elements: [
                    {title: 'top', target: 'padding-top', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'left', target: 'padding-left', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'right', target: 'padding-right', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'bottom', target: 'padding-bottom', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'margin',
                title: 'Margin',
                type: 'group',
                elements: [
                    {title: 'top', target: 'margin-top', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'left', target: 'margin-left', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'right', target: 'margin-right', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'bottom', target: 'margin-bottom', type: 'element', field: 'text', default: '', inline: false}
                ]
            }
        ];

        this.initialize(props);
    }
}