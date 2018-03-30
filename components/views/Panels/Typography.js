import React from 'react';
import BasePanel from '../Panel';
import TextShadow from '../Fields/TextShadow';

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

        props.config.insert({
            type: 'typography',
            empty: null
        });

        const { polyglot } = props.mainRoot;

        this.fields = [
            {
                key: 'font',
                title: polyglot.t('Font'),
                type: 'group',
                elements: [
                    {title: polyglot.t('color'), target: 'color', type: 'element', field: 'color', default: '', inline: false},
                    {title: polyglot.t('size'), target: 'font-size', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('style'), target: 'font-style', type: 'element', field: 'font', mode: 'style', default: '', inline: false},
                    {title: polyglot.t('weight'), target: 'font-weight', type: 'element', field: 'font', mode: 'weight', default: '', inline: false},
                    {title: polyglot.t('family'), target: 'font-family', type: 'element', field: 'font', mode: 'family', default: '', inline: false},
                    {title: polyglot.t('variant'), target: 'font-variant', type: 'element', field: 'select', options: {
                        normal: polyglot.t('Normal'),
                        'small-caps': polyglot.t('Small caps')
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'text-shadow',
                title: polyglot.t('Text Shadow'),
                type: 'group',
                elements:  [
                    { title: false, target: 'text-shadow', type: 'element', field: 'text-shadow', default: '', inline: false}
                ]
            },
            {
                key: 'letters',
                title: polyglot.t('Letters'),
                type: 'group',
                elements: [
                    {title: polyglot.t('line height'), target: 'line-height', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('vertical align'), target: 'vertical-align', type: 'element', field: 'select', options: {
                        'baseline': polyglot.t('Baseline'),
                        'sub': polyglot.t('Sub'),
                        'super': polyglot.t('Super'),
                        'top': polyglot.t('Top'),
                        'text-top': polyglot.t('Text top'),
                        'middle': polyglot.t('Middle'),
                        'bottom': polyglot.t('Bottom'),
                        'text-bottom': polyglot.t('Text bottom')
                    }, default: '', inline: false},
                    {title: polyglot.t('indent'), target: 'text-indent', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('letter spacing'), target: 'letter-spacing', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'text',
                title: polyglot.t('Text'),
                type: 'group',
                elements: [
                    {title: polyglot.t('align'), target: 'text-align', type: 'element', field: 'select', options: {
                        'left': polyglot.t('Left'),
                        'right': polyglot.t('Right'),
                        'center': polyglot.t('Center'),
                        'justify': polyglot.t('Justify')
                    }, default: '', inline: false},

                    {title: polyglot.t('transform'), target: 'text-transform', type: 'element', field: 'select', options: {
                        'none': polyglot.t('None'),
                        'capitalize': polyglot.t('Capitalize'),
                        'uppercase': polyglot.t('Uppercase'),
                        'lowercase': polyglot.t('Lowercase')
                    }, default: '', inline: false},

                    {title: polyglot.t('decoration'), target: 'text-decoration', type: 'element', field: 'select', options: {
                        'none': polyglot.t('None'),
                        'underline': polyglot.t('Underline'),
                        'overline': polyglot.t('Overline'),
                        'line-through': polyglot.t('Line through')
                    }, default: '', inline: false},

                    {title: polyglot.t('overflow'), target: 'text-overflow', type: 'element', field: 'select', options: {
                        'clip': polyglot.t('Clip'),
                        'ellipsis': polyglot.t('Ellipsis')
                    }, default: '', inline: false}

                ]
            },
            {
                key: 'words',
                title: polyglot.t('Words'),
                type: 'group',
                elements: [
                    {title: polyglot.t('word spacing'), target: 'word-spacing', type: 'element', field: 'text', default: '', inline: false},

                    {title: polyglot.t('wrap'), target: 'word-wrap', type: 'element', field: 'select', options: {
                        'normal': polyglot.t('Normal'),
                        'break-word': polyglot.t('Break word')
                    }, default: '', inline: false},

                    {title: polyglot.t('break'), target: 'word-break', type: 'element', field: 'select', options: {
                        'normal': polyglot.t('Normal'),
                        'break-word': polyglot.t('Break word')
                    }, default: '', inline: false},

                    {title: polyglot.t('white space'), target: 'white-space', type: 'element', field: 'select', options: {
                        'normal': polyglot.t('Normal'),
                        'nowrap': polyglot.t('No Wrap'),
                        'pre': polyglot.t('Pre'),
                        'pre-line': polyglot.t('Pre Line'),
                        'pre-wrap': polyglot.t('Pre Wrap')
                    }, default: '', inline: false}
                ]
            }
        ];

        this.initialize(props);
    }

    hookBeforeElementRender = (element, inputElement, inputProps) => {
        if (element.field === 'text-shadow') {
            inputProps.type = 'text';
            inputElement.push( <TextShadow { ...inputProps} /> );
        }
    };
}