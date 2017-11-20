import BasePanel from '../Panel';

class Border extends BasePanel {

    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {}
        };

        this.config = {
            type: 'border',
            empty: null
        };
        this.fields = [
            {
                key: 'width',
                title: 'Border Width',
                type: 'group',
                elements: [
                    {title: 'top', target: 'border-top-width', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'left', target: 'border-left-width', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'right', target: 'border-right-width', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'bottom', target: 'border-bottom-width', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'style',
                title: 'Border Style',
                type: 'group',
                elements: [
                    {title: 'top', target: 'border-top-style', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'left', target: 'border-left-style', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'right', target: 'border-right-style', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'bottom', target: 'border-bottom-style', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'color',
                title: 'Border Color',
                type: 'group',
                elements: [
                    {title: 'top', target: 'border-top-color', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'left', target: 'border-left-color', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'right', target: 'border-right-color', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'bottom', target: 'border-bottom-color', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'radius',
                title: 'Border Radius',
                type: 'group',
                elements: [
                    {title: 'top', target: 'border-top-radius', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'left', target: 'border-left-radius', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'right', target: 'border-right-radius', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'bottom', target: 'border-bottom-radius', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
        ];
        this.initialize(props);
    }
}


export default Border;