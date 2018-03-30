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

        props.config.insert({
            type: 'spacing',
            empty: null
        });

        const { polyglot } = props.mainRoot;

        this.fields = [
            {
                key: 'width',
                title: polyglot.t('Width'),
                type: 'group',
                elements: [
                    {title: polyglot.t('Min Width'), target: 'min-width', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Width'), target: 'width', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Max Width'), target: 'max-width', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'height',
                title: polyglot.t('Height'),
                type: 'group',
                elements: [
                    {title: polyglot.t('Min Height'), target: 'min-height', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Height'), target: 'height', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Max Height'), target: 'max-height', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'padding',
                title: polyglot.t('Padding'),
                type: 'group',
                elements: [
                    {title: polyglot.t('top'), target: 'padding-top', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('left'), target: 'padding-left', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('right'), target: 'padding-right', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('bottom'), target: 'padding-bottom', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'margin',
                title: polyglot.t('Margin'),
                type: 'group',
                elements: [
                    {title: polyglot.t('top'), target: 'margin-top', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('left'), target: 'margin-left', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('right'), target: 'margin-right', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('bottom'), target: 'margin-bottom', type: 'element', field: 'text', default: '', inline: false}
                ]
            }
        ];

        this.initialize(props);
    }
}