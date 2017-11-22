import BasePanel from '../Panel';

class Styles extends BasePanel {

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
                    {title: 'color', target: 'background-color', type: 'element', field: 'color', default: '', inline: true},
                    {title: 'image', target: 'background-image', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'position', target: 'background-position', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'repeat', target: 'background-repeat', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'advanced',
                title: false,
                type: 'group',
                elements: [
                    {title: 'attachment', target: 'background-attachment', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'size', target: 'background-size', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'clip', target: 'background-clip', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'origin', target: 'background-origin', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'visibility',
                title: 'Visibility',
                type: 'group',
                elements: [
                    {title: 'opacity', target: 'opacity', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'display', target: 'display', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'visibility', target: 'visibility', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'overflow', target: 'overflow', type: 'element', field: 'text', default: '', inline: true}
                ]
            }
        ];
        this.initialize(props);
    }
}


export default Styles;