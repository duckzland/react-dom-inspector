import BasePanel from '../Panel';

/**
 * Class for generating the typography panel inside the editor markup
 * This class is extending the BasePanel class
 *
 * @author jason.xie@victheme.com
 */
export default class Typography extends BasePanel {
    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {}
        };

        this.config.insert({
            type: 'typography',
            empty: null
        });

        this.fields = [
            {
                key: 'font',
                title: 'Font',
                type: 'group',
                elements: [
                    {title: 'color', target: 'color', type: 'element', field: 'color', default: '', inline: false},
                    {title: 'size', target: 'font-size', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'style', target: 'font-style', type: 'element', field: 'font', mode: 'style', default: '', inline: false},
                    {title: 'weight', target: 'font-weight', type: 'element', field: 'font', mode: 'weight', default: '', inline: false},
                    {title: 'family', target: 'font-family', type: 'element', field: 'font', mode: 'family', default: '', inline: false},
                    {title: 'variant', target: 'font-variant', type: 'element', field: 'select', options: {
                        normal: 'Normal',
                        'small-caps': 'Small caps'
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'letters',
                title: 'Letters',
                type: 'group',
                elements: [
                    {title: 'line height', target: 'line-height', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'vertical align', target: 'vertical-align', type: 'element', field: 'select', options: {
                        'baseline': 'Baseline',
                        'sub': 'Sub',
                        'super': 'Super',
                        'top': 'Top',
                        'text-top': 'Text top',
                        'middle': 'Middle',
                        'bottom': 'Bottom',
                        'text-bottom': 'Text bottom'
                    }, default: '', inline: false},
                    {title: 'indent', target: 'text-indent', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'letter spacing', target: 'letter-spacing', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'text',
                title: 'Text',
                type: 'group',
                elements: [
                    {title: 'align', target: 'text-align', type: 'element', field: 'select', options: {
                        'left': 'Left',
                        'right': 'Right',
                        'center': 'Center',
                        'justify': 'Justify'
                    }, default: '', inline: false},

                    {title: 'transform', target: 'text-transform', type: 'element', field: 'select', options: {
                        'none': 'None',
                        'capitalize': 'Capitalize',
                        'uppercase': 'Uppercase',
                        'lowercase': 'Lowercase'
                    }, default: '', inline: false},

                    {title: 'decoration', target: 'text-decoration', type: 'element', field: 'select', options: {
                        'none': 'None',
                        'underline': 'Underline',
                        'overline': 'Overline',
                        'line-through': 'Line through'
                    }, default: '', inline: false},

                    {title: 'overflow', target: 'text-overflow', type: 'element', field: 'select', options: {
                        'clip': 'Clip',
                        'ellipsis': 'Ellipsis'
                    }, default: '', inline: false},

                ]
            },
            {
                key: 'words',
                title: 'Words',
                type: 'group',
                elements: [
                    {title: 'word spacing', target: 'word-spacing', type: 'element', field: 'text', default: '', inline: false},

                    {title: 'wrap', target: 'word-wrap', type: 'element', field: 'select', options: {
                        'normal': 'Normal',
                        'break-word': 'Break word'
                    }, default: '', inline: false},

                    {title: 'break', target: 'word-break', type: 'element', field: 'select', options: {
                        'normal': 'Normal',
                        'break-word': 'Break word'
                    }, default: '', inline: false},

                    {title: 'white space', target: 'white-space', type: 'element', field: 'select', options: {
                        'normal': 'Normal',
                        'nowrap': 'No Wrap',
                        'pre': 'Pre',
                        'pre-line': 'Pre Line',
                        'pre-wrap': 'Pre Wrap'
                    }, default: '', inline: false}
                ]
            }
        ];

        this.initialize(props);
    }
}