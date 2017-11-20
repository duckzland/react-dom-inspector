import BasePanel from '../Panel';

class Spacing extends BasePanel {

    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {}
        };

        this.config = {
            type: 'spacing',
            empty: null
        };
        this.fields = [
            {
                key: 'size',
                title: 'Size',
                type: 'group',
                elements: [
                    {title: 'Width', target: 'width', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'Height', target: 'height', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'margin',
                title: 'Margin',
                type: 'group',
                elements: [
                    {title: 'top', target: 'margin-top', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'left', target: 'margin-left', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'right', target: 'margin-right', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'bottom', target: 'margin-bottom', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'padding',
                title: 'Padding',
                type: 'group',
                elements: [
                    {title: 'top', target: 'padding-top', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'left', target: 'padding-left', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'right', target: 'padding-right', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'bottom', target: 'padding-bottom', type: 'element', field: 'text', default: '', inline: true}
                ]
            }
        ];
        this.initialize(props);
    }
}


export default Spacing;