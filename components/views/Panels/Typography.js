import BasePanel from '../Panel';

class Typography extends BasePanel {

    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {}
        };

        this.config = {
            type: 'typography',
            empty: null
        };
        this.fields = [
            {
                key: 'font',
                title: 'Font',
                type: 'group',
                elements: [
                    {title: 'color', target: 'color', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'style', target: 'font-style', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'weight', target: 'font-weight', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'size', target: 'font-size', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'family', target: 'font-family', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'advanced',
                title: false,
                type: 'group',
                elements: [
                    {title: 'variant', target: 'font-variant', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'stretch', target: 'font-stretch', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'line height', target: 'line-height', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'vertical align', target: 'vertical-align', type: 'element', field: 'text', default: '', inline: true}
                ]
            },
            {
                key: 'text-align',
                title: 'Text',
                type: 'group',
                elements: [
                    {title: 'align', target: 'text-align', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'overflow', target: 'text-overflow', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'justify', target: 'text-justify', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'align last', target: 'text-align-last', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'wrap', target: 'word-wrap', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'break', target: 'word-break', type: 'element', field: 'text', default: '', inline: true},
                    {title: 'white space', target: 'white-space', type: 'element', field: 'text', default: '', inline: true}
                ]
            }
        ];
        this.initialize(props);
    }
}


export default Typography;